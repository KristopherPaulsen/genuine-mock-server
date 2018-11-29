module.exports = [
  {
    request: {
      method: 'post',
      path: '/api/helloworld',
    },
    response: {
      data: {
        'key': 'Hello World!',
      }
    },
  },
];
