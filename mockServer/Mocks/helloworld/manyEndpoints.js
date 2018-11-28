module.exports = [
  {
    request: {
      method: 'get',
      path: '/api/helloworld/manyendpoints/first',
      matchType: 'schema',
    },
    response: {
      data: {
        'key': 'The first',
      }
    },
  },

  {
    request: {
      method: 'get',
      path: '/api/helloworld/manyendpoints/second',
    },
    response: {
      data: {
        'key': 'The second',
      }
    },
  },

  {
    request: {
      method: 'get',
      path: '/api/helloworld/manyendpoints/third',
    },
    response: {
      data: {
        'key': 'The third',
      }
    },
  },
];
