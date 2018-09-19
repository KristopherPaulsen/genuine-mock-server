const { toKey } = require('../mockServer/MockingBird.js');

const mocks = [
  {
    '/api/example/param/:param': [
      {
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        response: {
          key: "no params, no body, no query response",
        }
      },
      {
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        params: {
          param: 'foo'
        },
        response: {
          key: "only params response",
        }
      },
      {
        method: 'delete',
        statusCode: 200,
        waitTime: 200,
        query: {
          param: 'bar',
        },
        response: {
          key: "query only response",
        }
      },
      {
        method: 'get',
        statusCode: 200,
        waitTime: 200,
        query: {
          foo: 'value here, IM DIFFEENT!',
        },
        params: {
          param: 'param value here',
        },
        response: {
          key: "params AND query response",
        }
      },
      {
        method: 'get',
        statusCode: 200,
        waitTime: 200,
        query: {
          foo: 'value here, IM DIFFEENT!',
        },
        params: {
          param: 'param value here',
        },
        body: {
          baz: "still a different value",
        },
        response: {
          key: "params, query, body response",
        }
      },
    ],
  },
  {
    '/api/example/otherparam/:param': [
      {
        method: 'get',
        waitTime: 0,
        statusCode: 200,
        params: {
          otherparam: 'bar',
        },
        response: {
          key: 'response for otherparam endpoint here'
        }
      }
    ]
  }
];

const flatMocks = {
  '/api/example/param/:param': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      response: {
        key: "no params, no body, no query response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      params: {
        param: 'foo'
      },
      response: {
        key: "only params response",
      }
    },
    {
      method: 'delete',
      statusCode: 200,
      waitTime: 200,
      query: {
        param: 'bar',
      },
      response: {
        key: "query only response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      query: {
        foo: 'value here, IM DIFFEENT!',
      },
      params: {
        param: 'param value here',
      },
      response: {
        key: "params AND query response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      query: {
        foo: 'value here, IM DIFFEENT!',
      },
      params: {
        param: 'param value here',
      },
      body: {
        baz: "still a different value",
      },
      response: {
        key: "params, query, body response",
      }
    },
  ],
  '/api/example/otherparam/:param': [
    {
      method: 'get',
      waitTime: 0,
      statusCode: 200,
      params: {
        otherparam: 'bar',
      },
      response: {
        key: 'response for otherparam endpoint here'
      }
    }
  ]
}

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
  mocks,
  flatMocks,
  mockRequestMap,
};
