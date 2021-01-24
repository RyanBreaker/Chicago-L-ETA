const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs')

const stopsFile = './data/stops.txt'
const stationParser = require('./data/stationParser')

const forceUseTestData = process.env.FORCE_TEST_DATA === 'true'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Force HTTPS in prod.
if (process.env.NODE_ENV === 'production') {
  app.use(
    require('express-sslify').HTTPS({
      // Flag required for Heroku proxy.
      trustProtoHeader: true
    })
  )
}

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops and data we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's Arrivals API.
*/
const allStations = stationParser(fs.readFileSync(stopsFile))
const testData = require('../client/src/testData')
const generateStationData = require('./data/dataHelpers')

/*
API Routes
*/

// TODO: Input validation/sanitation.
app.get('/api/station', (req, res) => {
  const query = req.query
  const useTestData = query.testData === 'true' || forceUseTestData

  // Start with the full list to filter down from.
  let stationsFiltered = useTestData ? testData : allStations

  // Check for ID filter.
  if (query.id) {
    stationsFiltered = stationsFiltered.filter((sta) => sta.id === query.id)
  } else {
    // Only check the others if no ID was given.
    // Check for name filter.
    if (query.name) {
      stationsFiltered = stationsFiltered.filter((sta) =>
        sta.name.toLowerCase().includes(query.name.toLowerCase().trim())
      )
    }

    // Check for accessibility filter.
    if (query.accessible === 'true') {
      stationsFiltered = stationsFiltered.filter((sta) => sta.accessible)
    }
  }

  // If test data, ETAs are already present in the data, or don't fetch any data if the query wasn't of an ID.
  if (useTestData || !query.id) return res.json(stationsFiltered)

  // Fetch the data if it isn't test data and an ID wasn't specified.
  return generateStationData(stationsFiltered).then((v) => res.json(v))
})

// Test data for testing, returns outdated but valid full set of data.
app.get('/api/station/testdata', (req, res) => res.json(testData))

// Catchall for all other routes.
app.get('/api/*', (req, res) => {
  res.status(404).json([{ error: true, message: 'Invalid route given' }])
})

// Setup static files for serving the React app.
const staticPath = path.join(__dirname, '..', 'client', 'build')
// Set static files.
app.use(express.static(path.join(staticPath)))
// Send the React index.html for any other unknown routes.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'))
})

module.exports = app
