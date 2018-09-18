module.exports = {
  path: '/api/betterbird/example',
  requests: [
    {
      method: 'get',
      params: {
        foo: 'value here',
      },
      body: {
        bar: 'body value here',
      },
      response: {
        key: "I am the response!",
      }
    },
    {
      method: 'get',
      params: {
        foo: 'value here',
      },
      body: {
        bar: 'body value here',
      },
      response: {
        key: "I am the response!",
      }
    },
  ],
}
