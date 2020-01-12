const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const ctaApi = require('./api/cta');

const stopsFile = './data/stops.txt';
const stationParser = require('./data/stationParser');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops and data we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's API.
*/

const stationStops = stationParser(fs.readFileSync(stopsFile));

/*
 Station schema:
 {
   id: station ID
   name: station name
   wheelchair: boolean, wheelchair access
 }
*/

const ctaKey = require('./config/keys').ctaKey;

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

const getStation = async mapid => {
  // Destructuring `eta` out of the returned data.
  const {
    data: {
      ctatt: { eta }
    }
  } = await ctaApi.request({
    // TODO: Refactor out these reused parameters.
    params: { key: ctaKey, mapid: mapid, outputType: 'JSON' }
  });

  return eta;
};

app.get('/api/station/all', async (req, res) => {
  const etas = await Promise.all(
    stationStops.map(async station => {
      const eta = await getStation(station.id);

      // Generation of data here.
      return {
        ...station,
        etas: eta.map(train => {
          return {
            id: station.id + train.rn + train.arrT,
            trainNumber: train.rn,
            destination: train.destNm,
            eta: train.arrT,
            lineName: lineNames[train.rt],
            due: train.isApp === '1'
          };
        })
      };
    })
  );

  res.json(etas);
});

const testData = require('./client/src/testData');

app.get('/api/testdata', (req, res) => {
  res.json(testData);
});

module.exports = app;
