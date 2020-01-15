# CTA Train Tracker

This application is a simple train tracker that reports the estimated ETAs of the next train at each station in the CTA (Chicago Transit Authority) system.

This application uses the CTA Arrivals API documented here:\
https://www.transitchicago.com/developers/ttdocs/#_Toc296199903

The backend is Node.js Express with Axios for the external API calls, frontend with React (/client) and also Axios to call the backend's own API. The frontend is also styled with lightly-customized Bootstrap 4.

## TODO

* Error handling.
  - Currently there isn't much error-checking in this application. This is something I'll add in as I learn more about how handle errors in Node and React.
* Additional filtering.
  - The only filtering currently available in this application is raw text filtering against the station names. I'd like to try adding filtering for lines, station accessibility, as well as maybe even fuzzy searching.
* Legend
  - A legend as a popup or alert or similar would be useful for users unfamiliar with the icons used.
