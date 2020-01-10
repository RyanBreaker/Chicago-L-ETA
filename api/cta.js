const axios = require('axios');
// const cta_key = require('../config/keys').ctaKey;

// Preformatted instance of axios for the CTA API.
module.exports = axios.create({
  baseURL: 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx'
});
