const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { defaults, sortBy, flow, keys, partial, _ } = require('lodash');
const md5 = require('md5');

const mockDefaults = {
  waitTime: 0,
  statusCode: 200,
  method: 'get',
  body: {},
  query: {},
  params: {},
  response: {
    'default': 'value was supplied',
  }
};

const getMocks = ({ pathToFiles, filePattern}) => (
  glob
  .sync(path.resolve(`${pathToFiles}/**/${filePattern}`))
  .map(file => require(path.resolve(file)))
);

const hashToColon = (path) => (path.replace(/\/(#)(\w+)/gi, '\/:$2'));

const toKey = (body = {}, query = {}, params = {}) => (
  [body, query, params].map(flow(JSON.stringify, sortBy, md5))
);

const requestsToMap = (rawMockMap) => (
  keys(rawMockMap).reduce((mockMap, path) => ({
    ...mockMap,
    [path]: {
      ...mockMap[path].reduce((reqMap, { body, query, params, method, ...response }) => ({
        ...reqMap,
        [method]: {
          ...reqMap[method],
          [toKey(body, query, params)]: {
            ...response,
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

const ensureDefaults = (mockDefaults, flatMocks) => (
  keys(flatMocks).reduce((accum, path) => ({
    ...accum,
    [path]: accum[path].map(data => defaults(data, mockDefaults)),
  }), flatMocks)
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
    partial(ensureDefaults, mockDefaults),
    requestsToMap,
    partial(registerRoutes, mockServer, _),
    () => mockServer.listen(port, () => console.log(`Listening on port: ${port}`))
  )(getMocks({ filePattern, pathToFiles }));
}

module.exports = {
  toKey,
  mockDefaults,
  ensureDefaults,
  flattenMocks,
  hashToColon,
  requestsToMap,
  init,
};
