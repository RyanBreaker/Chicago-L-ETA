const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const stopsFile = './data/stops.txt';
const stationParser = require('./data/stationParser');
const { generateStationData } = require('./data/dataHelpers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  // Force HTTPS in prod.
  app.use(
    require('express-sslify').HTTPS({
      // Flag required for Heroku proxy.
      trustProtoHeader: true
    })
  );
}

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops and data we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's Arrivals API.
*/
const allStations = stationParser(fs.readFileSync(stopsFile));

/*
API Routes
*/

app.get('/api/station/all', (req, res) => {
  generateStationData(allStations).then(v => res.json(v));
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

  generateStationData(stationsFiltered).then(v => res.json(v));
});

// Return just a list of all the stations.
app.get('/api/station/empty', (req, res) => {
  res.json(allStations);
});

const testData = require('./client/src/testData');
app.get('/api/station/testdata', (req, res) => {
  res.json(testData);
});

// For prod environments only, for serving static React app.
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
