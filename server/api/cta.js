const axios = require('axios')

const params = { key: require('../config/keys').ctaKey, outputType: 'JSON' }
const ctaApi = axios.create({
  baseURL: 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx'
})

// Preformatted instance of axios for the CTA API.
module.exports = { ctaApi, params }
