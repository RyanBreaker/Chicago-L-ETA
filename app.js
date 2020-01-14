const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const hash = require('object-hash');

const Queue = require('bull');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient(process.env.REDIS_URL || null);
const getAsync = promisify(redisClient.get).bind(redisClient);

const ctaApi = require('./api/cta');

const stopsFile = './data/stops.txt';
const stationParser = require('./data/stationParser');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  // Force HTTPS in prod.
  const enforce = require('express-sslify');
  app.use(
    enforce.HTTPS({ trustProtoHeader: true, trustXForwardedHostHeader: true })
  );
}

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops and data we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's API.
*/

const allStations = stationParser(fs.readFileSync(stopsFile));

/*
 Station schema:
 {
   id: station ID
   name: station name
   wheelchair: boolean, wheelchair access
 }
*/

const ctaKey = require('./config/keys').ctaKey;

const stationUpdateQueue = new Queue(
  'update station data',
  process.env.REDIS_URL || null
);
// noinspection JSUnusedLocalSymbols
stationUpdateQueue.process(job => {
  console.log('start');
  return Promise.all(
    allStations.map(sta => {
      return ctaApi
        .request({
          params: { key: ctaKey, mapid: sta.id, outputType: 'JSON' }
        })
        .then(response => {
          const ctatt = response.data.ctatt;
          redisClient.set(
            `ctaapi:${sta.id}`,
            JSON.stringify(ctatt.eta || []),
            'EX',
            300
          );
        });
    })
  ).then(() => console.log('done'));
});
stationUpdateQueue.add({}, { repeat: { every: 45000 } });
// stationUpdateQueue.on('completed', job => console.log(job, 'completed'));
// stationUpdateQueue.on('stalled', job => console.log('stalled', job));
// stationUpdateQueue.on('error', error => console.log('error', error));
// stationUpdateQueue.on('waiting', job => console.log('waiting', job));
// stationUpdateQueue.on('active', job => console.log('active', job));
// stationUpdateQueue.on('failed', (job, err) => console.log('failed', err));

const lineNames = {
  Pink: 'Pink Line',
  Blue: 'Blue Line',
  G: 'Green Line',
  Y: 'Yellow Line',
  P: 'Purple Line',
  Org: 'Orange Line',
  Brn: 'Brown line',
  Red: 'Red Line'
};

const getStation = mapid => {
  return getAsync(`ctaapi:${mapid}`).then(result => {
    if (result) {
      return JSON.parse(result);
    }
    return ctaApi
      .request({
        params: { key: ctaKey, mapid: mapid, outputType: 'JSON' }
      })
      .then(response => {
        const etas = response.data.ctatt.eta || [];
        redisClient.set(`ctaapi:${mapid}`, JSON.stringify(etas), 'EX', 30);
        return etas;
      });
  });
};

const generateData = stations => {
  return Promise.all(
    stations.map(station => {
      return getStation(station.id).then(etas => {
        return {
          ...station,
          etas: etas.map(train => {
            // noinspection JSUnresolvedVariable
            return {
              id: hash.MD5(train), // MD5 for speed, security not a factor
              trainNumber: train.rn,
              destination: train.destNm,
              generatedAt: train.prdt,
              eta: train.arrT,
              lineName: lineNames[train.rt],
              due: train.isApp !== '0',
              scheduled: train.isSch !== '0',
              delayed: train.isDly !== '0'
            };
          })
        };
      });
    })
  );
};

app.get('/api/station/all', (req, res) => {
  generateData(allStations).then(v => res.json(v));
});

// TODO: Input validation/sanitation.
app.get('/api/station/search', (req, res) => {
  let stationsFiltered = allStations;
  const query = req.query;

  // Check for name filter.
  if (query.name) {
    stationsFiltered = stationsFiltered.filter(sta =>
      sta.name.toLowerCase().includes(query.name.toLowerCase().trim())
    );
  }

  // Check for accessibility filter.
  if (query.accessible) {
    stationsFiltered = stationsFiltered.filter(sta => sta.accessible);
  }

  generateData(stationsFiltered).then(v => res.json(v));
});

const testData = require('./client/src/testData');
app.get('/api/testdata', (req, res) => {
  res.json(testData);
});

// For prod environments only.
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'client', 'build');

  // Set static files.
  app.use(express.static(path.join(staticPath)));
  // Send the React index.html for any other unknown routes.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
  });
}

module.exports = app;
