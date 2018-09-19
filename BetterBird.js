const glob = require('glob');
const path = require('path');
const express = require('express');
const {
  concat, toString, sortBy, flattenDeep,
  isEqual, flow, difference, keys,
  toPairs, partial, replace, _,
} = require('lodash');

const stringHash = require('string-hash');
const paramsToRegex = url => url.replace(/((?::|#)[\w-]*)/g, '[\\w-]*');

const getMocks = ({ pathToFiles, filePattern}) => (
  glob
  .sync(path.resolve(path.resolve(`${pathToFiles}/**/${filePattern}`)))
  // eslint-disable-next-line
  .map(file => require(path.resolve(file)))
);

const toKey = flow(
  (body, params) => [...toPairs(body), ...toPairs(params)],
  array => array.length ? array : ['default', 'default'],
  flattenDeep,
  sortBy,
  toString,
);

const requestsToMap = (rawMockMap) => (
  keys(rawMockMap).reduce((mockMap, path) => ({
    ...mockMap,
    [path]: {
      ...mockMap[path].requests.reduce((reqMap, { body, params, statusCode, waitTime, method, response }) => ({
        [method]: {
          ...reqMap[method],
          [toKey(body, params)]: {
            statusCode,
            waitTime,
            response,
          }
        }
      }), {}),
    }
  }), rawMockMap)
);

const nestRequests = (mocks) => (
  mocks.reduce((accum, { path, requests } ) => ({
    ...accum,
    [path]: {
      requests,
    }
  }), {})
);

const route = (
  res, stuff,
) => {
  console.log(stuff);
  setTimeout(() => {
    res.status(stuff.statusCode)
      .send(stuff.response);
  }, stuff.waitTime)
};

const registerRoutes = (server, mockMap) => (
  keys(mockMap).forEach(path => {
    keys(mockMap[path]).forEach(method => {
      server[method](paramsToRegex(path), ({ body, query }, res) => {
        console.log(body, query);
        route(res, mockMap[path][method][toKey(body, query)]);
      });
    })
  })
)

const init = ({ port, filePattern, pathToFiles }) => {
  const mockServer = express();
  const bodyParser = require('body-parser');

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
    nestRequests,
    requestsToMap,
    partial(registerRoutes, mockServer, _),
    () => mockServer.listen(port, () => console.log(`Listening on port: ${port}`))
  )(getMocks({ filePattern, pathToFiles }));
}

const data = flow(
  nestRequests,
  requestsToMap,
)(getMocks({ filePattern: '*.js', pathToFiles: './mockServer/Mocks/'}));

init({
  port: 8080,
  pathToFiles: './mockServer/Mocks/',
  filePattern: '*.js',
});
