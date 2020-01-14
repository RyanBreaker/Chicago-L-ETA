const axios = require('axios');

// Preformatted instance of axios for the CTA API.
module.exports = axios.create({
  baseURL: 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx'
});
