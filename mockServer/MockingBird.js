const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const {
  concat, toString, sortBy, flattenDeep,
  flow, keys, toPairs, partial, replace, _,
} = require('lodash');

const hashToColon = (path) => (path.replace(/(#)(\w+)/, ':$2'));

const getMocks = ({ pathToFiles, filePattern}) => (
  glob
  .sync(path.resolve(path.resolve(`${pathToFiles}/**/${filePattern}`)))
  .map(file => require(path.resolve(file)))
);

const toKey = (body = {}, query = {}, params = {}) => (
  [body, query, params].map(item => sortBy(JSON.stringify(item)))
);

const requestsToMap = (rawMockMap) => (
  keys(rawMockMap).reduce((mockMap, path) => ({
    ...mockMap,
    [path]: {
      ...mockMap[path].reduce((reqMap, { params, body, query, statusCode, waitTime, method, response }) => ({
        ...reqMap,
        [method]: {
          ...reqMap[method],
          [toKey(body, query, params)]: {
            statusCode,
            waitTime,
            response,
          }
        }
      }), {}),
    }
  }), rawMockMap)
);

const flattenMocks = (mocks) => (
  mocks.reduce((accum, mock) => ({
    ...accum,
    ...mock,
  }), {})
);

const hashesToColons = (flatMocks) => (
   keys(flatMocks).reduce((noHashes, path) => ({
    ...noHashes,
    [hashToColon(path)]: flatMocks[path],
  }), flatMocks)
);

const route = (
  res, { statusCode, response, waitTime },
) => (
  setTimeout(() => (
    res.status(statusCode)
       .send(response)
  ), waitTime)
);

const registerRoutes = (server, mockMap) => (
  keys(mockMap).forEach(path => {
    keys(mockMap[path]).forEach(method => {
      server[method](path, ({ body, query, params }, res) => {
        const reqKey = toKey(body, query, params);
        route(res, mockMap[path][method][reqKey]);
      });
    })
  })
)

const init = ({ port, filePattern, pathToFiles }) => {
  const mockServer = express();

  mockServer.use(bodyParser.json());
  mockServer.use(bodyParser.urlencoded({
      extended: true
  }));

  mockServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  flow(
    flattenMocks,
    hashesToColons,
    requestsToMap,
    partial(registerRoutes, mockServer, _),
    () => mockServer.listen(port, () => console.log(`Listening on port: ${port}`))
  )(getMocks({ filePattern, pathToFiles }));
}

module.exports = {
  toKey,
  flattenMocks,
  requestsToMap,
  init,
};
