const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient(process.env.REDIS_URL || null);
const getAsync = promisify(redisClient.get).bind(redisClient);

const ctaApi = require('../api/cta');
const params = { key: require('../config/keys').ctaKey, outputType: 'JSON' };

const lineNames = {
  Pink: 'Pink Line',
  Blue: 'Blue Line',
  G: 'Green Line',
  Y: 'Yellow Line',
  P: 'Purple Line',
  Org: 'Orange Line',
  Brn: 'Brown line',
  Red: 'Red Line'
};

const getStation = mapid => {
  return getAsync(`ctaapi:${mapid}`).then(result => {
    if (result) {
      return JSON.parse(result);
    }
    return ctaApi
      .request({
        params: { ...params, mapid: mapid }
      })
      .then(response => {
        const etas = response.data.ctatt.eta || [];
        redisClient.set(`ctaapi:${mapid}`, JSON.stringify(etas), 'EX', 30);
        return etas;
      });
  });
};

const generateStationData = stations => {
  return Promise.all(
    stations.map(station => {
      return getStation(station.id).then(etas => {
        return {
          ...station,
          etas: etas.map(train => {
            // noinspection JSUnresolvedVariable
            return {
              id: hash.MD5(train), // MD5 for speed, security not a factor
              trainNumber: train.rn,
              destination: train.destNm,
              generatedAt: train.prdt,
              eta: train.arrT,
              lineName: lineNames[train.rt],
              due: train.isApp !== '0',
              scheduled: train.isSch !== '0',
              delayed: train.isDly !== '0'
            };
          })
        };
      });
    })
  );
};

module.exports = { generateStationData, lineNames };
