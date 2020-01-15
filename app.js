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

// Force HTTPS in prod.
if (process.env.NODE_ENV === 'production') {
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

// Return a list of all stations with all ETAs.
// WARNING: This is VERY EXPENSIVE!!!
app.get('/api/station/all', (req, res) =>
  generateStationData(allStations).then(v => res.json(v))
);

// TODO: Input validation/sanitation.
app.get('/api/station/search', (req, res) => {
  const query = req.query;

  // Start with the full list to filter down from.
  let stationsFiltered = allStations;

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

  return generateStationData(stationsFiltered).then(v => res.json(v));
});

// Return just a list of all the stations.
app.get('/api/station/empty', (req, res) => res.json(allStations));

// Get station by ID.
app.get('/api/station/id/:staId', (req, res) => {
  const staId = req.params.staId;

  // Find matching station with ID and return it.
  const station = allStations.filter(sta => sta.id === staId);
  return generateStationData(station).then(v => res.json(v));
  // If no matching station was found, only an empty array will be generated.
});

// Test data for testing, returns outdated but valid full set of data.
const testData = require('./client/src/testData');
app.get('/api/station/testdata', (req, res) => res.json(testData));

// Catchall for all other routes.
app.get('/api/*', (req, res) => {
  res.status(404).json([{ error: true, message: 'Invalid route given' }]);
});

// Setup static files for serving the React app.
const staticPath = path.join(__dirname, 'client', 'build');
// Set static files.
app.use(express.static(path.join(staticPath)));
// Send the React index.html for any other unknown routes.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

module.exports = app;
