const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { get, flatten, defaultsDeep, sortBy, flow, keys, partial, _ } = require('lodash');
const stringify  = require('json-stable-stringify')

const mockDefaults = {
  request: {
    path: '',
    method: 'get',
    body: {},
    query: {},
    params: {},
  },
  response: {
    data: {},
    waitTime: 0,
    statusCode: 200,
  }
};

const hashToColon = (path) => {
  if(!path.match(/(\/[\w-_]+\?.+)/)) {
    return path.replace(/#/g, ':');
  }

  const [_, paramPath, queryPath] = path.match(/(.+?)(\/[\w-_]+\?.+)/);

  return `${paramPath.replace(/#/g, ':')}${queryPath}`;
}

const getSuppliedMocks = ({ mocks }) => mocks;

const getMockStrategy = ({ mocks, pathToFiles}) => {
  if (mocks && !pathToFiles) {
    return getSuppliedMocks;
  }

  if (!mocks && pathToFiles) {
    return getSlurpedMocks;
  }

  return getCombinedMocks;
}

const getSlurpedMocks = ({ pathToFiles, filePattern }) => (
  flatten(
    glob
    .sync(path.resolve(`${pathToFiles}/**/${filePattern}`))
    .map(file => require(path.resolve(file)))
  )
)

const getCombinedMocks = ({ pathToFiles, filePattern, mocks }) => ([
    ...mocks,
    ...getSlurpedMocks({ pathToFiles, filePattern, }),
]);

const toKey = (body, query, params) => (
  [body, query, params].map(stringify)
);

const defaultPath = (path, rawMocks) => (
  rawMocks.map(rawMock => ({
      ...rawMock,
      request: {
        ...rawMock.request,
        path: get(rawMock, 'request.path', path),
      }
  }))
);

const route = (
  res, { statusCode, data, waitTime },
) => (
  setTimeout(() => (
    res.status(statusCode)
       .send(data)
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

const toRequestMap = (rawMocks) => (
  rawMocks.reduce((requestMap, rawMock) => {

    const {
      request: {
        method, body, query, params, path, ...request
      },
      response
    } = defaultsDeep(rawMock, mockDefaults);

    const normalizedPath = hashToColon(path)

    return {
      ...requestMap,
      [normalizedPath]: {
        ...requestMap[normalizedPath],
        [method]: {
          ...get(requestMap, [normalizedPath, method], {}),
          [toKey(body, query, params)]: response,
        }
      }
    }
  }, {})
);


const init = ({ port, ...mockConfig }) => {
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

  const getMocks = getMockStrategy(mockConfig);

  flow(
    toRequestMap,
    partial(registerRoutes, mockServer, _),
    partial(startListening, mockServer, port)
  )(getMocks(mockConfig));
}

module.exports = {
  getMockStrategy,
  getSuppliedMocks,
  getCombinedMocks,
  getSlurpedMocks,
  toKey,
  toRequestMap,
  hashToColon,
  defaultPath,
  init,
};

