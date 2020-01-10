const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const data_file = './data/stops.txt';
const stopParser = require('./data/stop_parser');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
On server startup, load the local list of stops supplied by the CTA as a CSV into an object,
filtering out the stops we don't care about (i.e. bus stops).

This has to be done locally due to a lack of API functionality for getting said list. Instead, CTA provides
frequently-updated files for download to use instead. Everything else will be completed via CTA's API.
*/

// Using the synchronous version of readFile to guarantee the server doesn't start before data is loaded.
const station_stops = stopParser(fs.readFileSync(data_file));

app.get('/api/get_stops', res => {
  return res.json({});
});

module.exports = app;
