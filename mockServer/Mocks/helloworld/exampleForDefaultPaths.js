const { defaultPath } = require('../../MockingBird.js');

module.exports = defaultPath('/api/helloworld/defaultpath', [
  {
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    response: {
      "foo": "Hello world!",
    }
  },
  {
    path: '/api/helloworld/definedpath'
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    response: {
      key: "I wasn't overwritten by defaultPath!",
    }
  },
]);
