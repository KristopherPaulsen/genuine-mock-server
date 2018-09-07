const mocks = [
  {
    path: '/api/users/:userId/endpoint',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the nonQueryEndpoint get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the nonQueryEndpoint put response',
        },
      },
    },
  },
  {
    path: '/api/:userId/param/:param/queryendpoint?foo=100',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=100 path-param get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=100 path-param put response',
        },
      },
    },
  },
  {
    path: '/api/:userId/queryendpoint?foo=100',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=100 get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=100 put response',
        },
      },
    },
  },
  {
    path: '/api/:userId/queryendpoint?foo=200',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=200 get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the foo=200 put response',
        },
      },
    },
  },
  {
    path: '/api/:userId/queryendpoint',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the blank query endpoint get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the blank query endpoint put response',
        },
      },
    },
  },
  {
    path: '/external-api/jsonplaceholder.typicode.com/posts/5',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          external: ' I am the mocked external api data!',
        },
      },
    },
  },
];

const nonQueryMocks = [
  {
    path: '/api/users/:userId/endpoint',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the nonQueryEndpoint get response',
        },
      },
      put: {
        statusCode: 200,
        waitTime: 0,
        response: {
          key: 'This is the nonQueryEndpoint put response',
        },
      },
    },
  },
  {
    path: '/external-api/jsonplaceholder.typicode.com/posts/5',
    methods: {
      get: {
        statusCode: 200,
        waitTime: 0,
        response: {
          external: ' I am the mocked external api data!',
        },
      },
    },
  },
];

const finalQueryPathMap = {
  '/api/:userId/queryendpoint': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '100',
      },
      response: {
        key: 'This is the foo=100 get response',
      },
    },
    {
      method: 'put',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '100',
      },
      response: {
        key: 'This is the foo=100 put response',
      },
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '200',
      },
      response: {
        key: 'This is the foo=200 get response',
      },
    },
    {
      method: 'put',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '200',
      },
      response: {
        key: 'This is the foo=200 put response',
      },
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      query: {},
      response: {
        key: 'This is the blank query endpoint get response',
      },
    },
    {
      method: 'put',
      statusCode: 200,
      waitTime: 0,
      query: {},
      response: {
        key: 'This is the blank query endpoint put response',
      },
    },
  ],
  '/api/:userId/param/:param/queryendpoint': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '100',
      },
      response: {
        key: 'This is the foo=100 path-param get response',
      },
    },
    {
      method: 'put',
      statusCode: 200,
      waitTime: 0,
      query: {
        foo: '100',
      },
      response: {
        key: 'This is the foo=100 path-param put response',
      },
    },
  ],
};

module.exports = {
  mocks,
  finalQueryPathMap,
  nonQueryMocks,
};
