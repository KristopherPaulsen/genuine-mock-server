const { toKey } = require('../mockServer/MockingBird.js');

const mockRequestMap = {
  "/api/example/param/:param": {
    "get": {
      [toKey({}, {}, {})]: {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "no params, no body, no query response"
        }
      },
    },
    "delete": {
      [toKey({}, {}, { param: 'param value here' })]: {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "only params response"
        }
      },
    }
  },
  "/api/example/otherparam/:param": {
    "delete": {
      [toKey({}, { foo: "another value"}, { param: "param value here" })]: {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "params, query response"
        }
      }
    }
  }
};

module.exports = {
  mockRequestMap,
};
