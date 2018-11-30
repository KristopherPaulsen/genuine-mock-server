const { init } = require('../../mockServer/MockingBird.js');

init({
  port: 8080,
  pathToFiles: './Mocks/',
  filePattern: '*.js', // whatever file extension you want to target
  mocks: [
    {
      request: {
        method: 'get',
        path: '/api/helloworld/suppliedmock',
      },
      response: {
        data: {
          'key': 'I was supplied!',
        }
      },
    },
  ]
});
