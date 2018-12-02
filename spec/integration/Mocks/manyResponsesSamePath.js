module.exports = [
  {
    request: {
      method: 'get',
      path: '/api/helloworld/manyresponses',
      query: {
        type: 'first',
      }
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
      path: '/api/helloworld/manyresponses',
      query: {
        type: 'second',
      }
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
      path: '/api/helloworld/manyresponses',
      query: {
        type: 'third'
      }
    },
    response: {
      data: {
        'key': 'The third',
      }
    },
  },
];
