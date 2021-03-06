// Explicitly using synchronous form of the function.
const csvParse = require('csv-parse/lib/sync')

// Range of stop_ids we care about to filters out bus stops, etc.
// The CTA API documentation defines a range of 40000 through 49999 for the stop_id property for station stops.
const stationRange = {
  start: 40000,
  end: 49999
}

// Expects an object from the csv-parser function
const checkRecord = (record) => {
  // If the current record's stop_id is between the station_range numbers...
  if (
    record.stop_id >= stationRange.start &&
    record.stop_id <= stationRange.end
  ) {
    // ...process the record.
    return {
      id: record.stop_id,
      name: record.stop_name,
      accessible: record.wheelchair_boarding === '1',
      etas: []
    }
    // Otherwise, discard the record.
  }
}

// This functions expects text in CSV-format as provided by the CTA API.
// Return the list sorted alphabetically by station name.
const stationParser = (text) =>
  csvParse(text, { columns: true, on_record: checkRecord }).sort((a, b) =>
    a.name > b.name ? 1 : -1
  )

module.exports = stationParser
