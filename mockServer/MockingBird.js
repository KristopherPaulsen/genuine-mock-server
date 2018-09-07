const glob = require('glob');
const path = require('path');
const { isEqual, flow, difference, keys } = require('lodash');

const queryString = /(?:\?)(.*)(?!:\/)/;
const toBasePath = url => url.replace(/(\/[a-zA-Z0-9-_]*)(\?.*)/, '$1');
const paramsToRegex = url => url.replace(/((?::|#)[a-zA-Z0-9-_]*)/g, '[a-zA-Z0-9-_]*');

const parseQueryString = (query) => {
  if (!query.match(queryString)) {
    return {};
  }

  // TODO: Sweet Mary and Joseph, replace this Stackoverflow copy-paste madness...
  return JSON.parse(
    // eslint-disable-next-line
    '{"' + decodeURI(query.match(queryString)[1].replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}'
  );
};

const areEquivalent = (serverQuery, queryMock) => {
  if (keys(serverQuery).length !== keys(queryMock).length) {
    return false;
  }

  return keys(serverQuery).every(key => (
    serverQuery[key] === queryMock[key] || queryMock[key].match(/#|:/)
  ));
};

const rawMocks = glob
  .sync(path.resolve(path.resolve('mockServer/Mocks/**/**/*.json')))
  // eslint-disable-next-line
  .map(file => require(path.resolve(file)));

const toQueryMocks = mock => (
  Object.keys(mock.methods).reduce((queryMocks, method) => {
    const currentMock = mock.methods[method];
    return [
      ...queryMocks,
      {
        method,
        query: parseQueryString(mock.path),
        statusCode: currentMock.statusCode,
        response: currentMock.response,
        waitTime: currentMock.waitTime,
      },
    ];
  }, [])
);

const toQueryPathMap = mocks => (
  mocks.reduce((queryPathMap, mock) => {
    const basePath = toBasePath(mock.path);
    return {
      ...queryPathMap,
      [basePath]: [
        ...(queryPathMap[basePath] ? queryPathMap[basePath] : []),
        ...toQueryMocks(mock),
      ],
    };
  }, {})
);

const route = (
  res, { statusCode = 200, response = {}, waitTime = 0 },
) => (
  setTimeout(() => {
    res.status(statusCode)
      .send(response);
  }, waitTime)
);

const toFinalQueryPathMap = (mocks, subsetPathMap) => (
  mocks.reduce((finalQueryPathMap, mock) => {
    if (subsetPathMap[mock.path]) {
      return {
        ...finalQueryPathMap,
        [mock.path]: [
          ...finalQueryPathMap[mock.path],
          ...toQueryMocks(mock),
        ],
      };
    }
    return finalQueryPathMap;
  }, subsetPathMap)
);

const routesForQueryMocks = (server, queryPathMap) => {
  Object.keys(queryPathMap).forEach((basePath) => {
    server.all(paramsToRegex(basePath), (req, res) => {
      const mockForRoute = queryPathMap[basePath].find(queryMock => (
        areEquivalent(req.query, queryMock.query) && queryMock.method.match(req.method.toLowerCase())
      ));
      route(res, mockForRoute);
    });
  });
};

const routesForNonQueryMocks = (server, nonQueryMocks) => (
  nonQueryMocks.forEach((mock) => {
    Object.keys(mock.methods).forEach((method) => {
      server[method](mock.path, (req, res) => (
        route(res, mock.methods[method])
      ));
    });
  })
);

const getPartitionedMocks = flow(
  mocks => ([
    toFinalQueryPathMap(
      mocks,
      toQueryPathMap(mocks.filter(mock => mock.path.match(queryString))),
    ),
    mocks,
  ]),
  ([completeQueryPathMap, mocks]) => ([
    mocks.filter(mock => !completeQueryPathMap[toBasePath(mock.path)]),
    completeQueryPathMap,
  ])
);

module.exports = {
  areEquivalent,
  queryString,
  parseQueryString,
  paramsToRegex,
  toBasePath,
  rawMocks,
  toQueryMocks,
  toQueryPathMap,
  route,
  routesForQueryMocks,
  routesForNonQueryMocks,
  getPartitionedMocks,
  toFinalQueryPathMap,
};
