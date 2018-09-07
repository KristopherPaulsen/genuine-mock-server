const express = require('express');
const { flow } = require('lodash');
const {
  getPartitionedMocks,
  routesForNonQueryMocks,
  routesForQueryMocks,
  rawMocks,
} = require('./MockingBird.js');

const mockServer = express();

mockServer.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

flow(
  getPartitionedMocks,
  ([nonQueryMocks, finalQueryPathMap]) => {
    routesForNonQueryMocks(mockServer, nonQueryMocks);
    routesForQueryMocks(mockServer, finalQueryPathMap);
  },
  // eslint-disable-next-line
  () => mockServer.listen(8080, () => console.log("Listening on port:8080"))
)(rawMocks);
