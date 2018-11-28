const glob = require('glob');
const path = require('path');
const bodyParser = require('body-parser');
const Ajv = require('ajv');
const express = require('express');
const {
  isEqual, get, flatten, defaultsDeep,
  sortBy, flow, keys, partial, _
} = require('lodash');

const requestDefaults = {
  path: '',
  method: 'get',
  body: {},
  query: {},
  params: {},
  matchType: 'exact',
};

const responseDefaults = {
    data: {},
    waitTime: 0,
    statusCode: 200,
};

const hashToColon = (path) => {
  if(!path.match(/(\/[\w-_]+\?.+)/)) {
    return path.replace(/#/g, ':');
  }

  const [_, paramPath, queryPath] = path.match(/(.+?)(\/[\w-_]+\?.+)/);

  return `${paramPath.replace(/#/g, ':')}${queryPath}`;
}

const getMockStrategy = ({ mocks, pathToFiles}) => {
  if (mocks && !pathToFiles) {
    return getSuppliedMocks;
  }

  if (!mocks && pathToFiles) {
    return getSlurpedMocks;
  }

  return getCombinedMocks;
}

const getSuppliedMocks = ({ mocks }) => mocks;

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

const normalizeMocks = (mocks) => (
  mocks.map(({ request, response }) => ({
    request: {
      ...defaultsDeep(request, requestDefaults),
      path: hashToColon(request.path),
    },
    response: defaultsDeep(response, responseDefaults),
  }))
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

const registerRoutes = (server, mocks) => (
  mocks.forEach(mock => {
    server[mock.request.method](mock.request.path, ({ body, query, params } , res) => {
      const bestMatch = mocks.find(mock => areEqual({
        matchType: mock.request.matchType,
        expected: {
          body: mock.request.body,
          query: mock.request.query,
          params: mock.request.params,
        },
        recieved: {
          body,
          query,
          params
        }
      }));

      route(res, bestMatch.response);
    })
  })
);

const areEqual = ({ matchType, expected, recieved }) => {
  if (matchType === 'exact') {
    return isEqual(
      [expected.body, expected.query, expected.params]
      [recieved.body, recieved.query, recieved.params]
    );
  }

  return every(keys(expected), key => {
    return matchesSchema(expected[key], recieved[key]);
  });
};

const matchesSchema = (schema, recieved) => {
  var ajv      = new Ajv({allErrors: true});
  var validate = ajv.compile(schema);
  var isValid  = validate(recieved);

  return Boolean(isValid);
}

const startListening = (server, port) => (
  server.listen(port, () => console.log(`Listening on port: ${port}`))
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
    normalizeMocks,
    partial(registerRoutes, mockServer, _),
    partial(startListening, mockServer, port)
  )(getMocks(mockConfig));
}

module.exports = {
  areEqual,
  normalizeMocks,
  getMockStrategy,
  getSuppliedMocks,
  getCombinedMocks,
  getSlurpedMocks,
  hashToColon,
  defaultPath,
  init,
};
