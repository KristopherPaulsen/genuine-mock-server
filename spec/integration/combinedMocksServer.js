const { init } = require('../../mockServer/MockingBird.js');

init({
  port: 8080,
  pathToFiles: 'spec/integration/Mocks',
  filePattern: '*.js', // whatever file extension you want to target
  mocks: [
    {
      request: {
        method: 'get',
        path: '/api/helloworld/suppliedmock',
      },
      response: {
        data: {
          'key': 'I am the hello world example from a supplied mock!',
        }
      },
    },
  ]
});
