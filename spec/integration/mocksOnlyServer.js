const { init } = require('../../mockServer/MockingBird.js');

init({
  port: 8080,
  mocks: [
    {
      request: {
        method: 'get',
        path: '/api/helloworld/suppliedmock/first',
      },
      response: {
        data: {
          'key': 'I am the first supplied mock',
        }
      },
    },

    {
      request: {
        method: 'get',
        path: '/api/helloworld/suppliedmock/second',
      },
      response: {
        data: {
          'key': 'I am the second supplied mock',
        }
      },
    },
  ]
});
