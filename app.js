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
app.use(express.static(path.join(__dirname, 'public')));

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops and data we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's API.
*/

// Using the synchronous version of readFile to guarantee the server doesn't start before data is loaded.
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

app.get('/api/station/all', async (_, res) => {
  const etas = await Promise.all(
    stationStops.map(async station => {
      // Destructuring `eta` out of the returned data.
      const {
        data: {
          ctatt: { eta }
        }
        // TODO: Factor out these reused parameters.
      } = await ctaApi.request({
        params: { key: ctaKey, mapid: station.id, outputType: 'JSON' }
      });

      return {
        ...station,
        etas: eta.map(train => {
          return {
            destination: train.destNm,
            eta: train.arrT,
            route: train.rt,
            due: train.isApp === '1'
          };
        })
      };
    })
  );

  res.json(etas);
});

// app.get('/api/station/id/:stationId', (req, res) => {
//   res.json(req.params);
// });
//
// app.get('/api/route/id/:routeId', (req, res) => {});

module.exports = app;
