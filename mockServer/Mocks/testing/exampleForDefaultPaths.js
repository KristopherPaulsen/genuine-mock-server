module.exports = [
  {
    req: {
      path: '/api/helloworld/definedpath',
      method: 'get',
    },
    resp: {
      data: {
        "foo": "Hello world!",
      }
    }
  },

  {
    req: {
      path: '/api/helloworld/definedpath2',
      method: 'get',
      body: {},
      query: {},
      params: {},
    },
    resp: {
      waitTime: 200,
      statusCode: 100,
      data: {
        "foo": "Hello world!",
      }
    }
  },
];
