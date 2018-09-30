const { init } = require('./mockServer/MockingBird.js');

const mocks = [
  {
    path: '/api/helloworld/simple',
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    response: {
      "key": "Hello world!",
    }
  },
];

init({
  port: 8080,
  mocks,
});
