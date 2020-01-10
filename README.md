# CTA Train Tracker

This application is a simple train tracker that reports the estimated ETAs of the next train at each station in the CTA (Chicago Transit Authority) system.

This application uses the CTA Arrivals API documented here:
https://www.transitchicago.com/assets/1/6/cta_Train_Tracker_API_Developer_Guide_and_Documentation.pdf

The backend uses Express with Axios for the external API calls and the frontend with React and also Axios to call the backend's own API.
