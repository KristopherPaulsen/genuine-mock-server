module.exports = {
  '/api/betterbird/example': [
    {
      statusCode: 200,
      waitTime: 0,
      method: 'get',
      query: {},
      response: {
        key: "I am empty response!",
      }
    },
    {
      statusCode: 200,
      waitTime: 200,
      method: 'get',
      query: {
        foo: 'bar',
      },
      response: {
        key: "I am query response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      query: {
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
