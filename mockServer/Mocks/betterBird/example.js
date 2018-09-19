module.exports = {
  path: '/api/betterbird/example',
  requests: [
    {
      statusCode: 200,
      waitTime: 0,
      method: 'get',
      params: {},
      response: {
        key: "I am empty response!",
      }
    },
    {
      statusCode: 200,
      waitTime: 200,
      method: 'get',
      params: {
        foo: 'bar',
      },
      response: {
        key: "I am params response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      params: {
        foo: 'value here, IM DIFFEENT!',
      },
      body: {
        bar: 'body value here',
      },
      response: {
        key: "I am the response, and the last one",
      }
    },
  ],
}
