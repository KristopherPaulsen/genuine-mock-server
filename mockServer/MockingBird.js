const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { get, flatten, defaults, sortBy, flow, keys, partial, _ } = require('lodash');
const md5 = require('md5');

const mockDefaults = {
  path: '',
  waitTime: 0,
  statusCode: 200,
  method: 'get',
  body: {},
  query: {},
  params: {},
  response: {}
};

const hashToColon = (path) => {
  if(!path.match(/(\/[\w-_]+\?.+)/)) {
    return path.replace(/#/g, ':');
  }

  const [_, paramPath, queryPath] = path.match(/(.+?)(\/[\w-_]+\?.+)/);

  return `${paramPath.replace(/#/g, ':')}${queryPath}`;
}

const getMocks = ({ pathToFiles, filePattern}) => (
    glob
    .sync(path.resolve(`${pathToFiles}/**/${filePattern}`))
    .map(file => require(path.resolve(file)))
);

const toKey = (body = {}, query = {}, params = {}) => (
  [body, query, params].map(flow(JSON.stringify, sortBy, md5))
);

const withPath = (path, rawMocks) => (
  rawMocks.map(mock => ({
    ...mock,
    path,
  }))
);

const toRequestMap = (rawMocks) => (
  flatten(rawMocks).reduce((requestMap, rawMock) => {

    const { path, body, query, params, method, ...restOfMock } = defaults(rawMock, mockDefaults);
    const normalizedPath = hashToColon(path)

    return {
      ...requestMap,
      [normalizedPath]: {
        ...requestMap[normalizedPath],
        [method]: {
          ...get(requestMap, [normalizedPath, method], {}),
          [toKey(body, query, params)]: restOfMock,
        }
      }
    }
  }, {})
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

const startListening = (server, port) => (
  server.listen(port, () => console.log(`Listening on port: ${port}`))
);

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
    toRequestMap,
    partial(registerRoutes, mockServer, _),
    partial(startListening, mockServer, port)
  )(getMocks({ filePattern, pathToFiles}));
}

module.exports = {
  toKey,
  toRequestMap,
  hashToColon,
  withPath,
  init,
};
