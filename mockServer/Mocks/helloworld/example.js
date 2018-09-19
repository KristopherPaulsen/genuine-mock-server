module.exports = {
  '/api/helloworld/example': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      response: {
        key: "no params, no body, no query response",
      }
    },
  ],
  '/api/helloworld/querystring': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      query: {
        bar: 'foo'
      },
      response: {
        key: "only query response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      params: {
        param: 'foo',
        param2: 'fooagain',
      },
      response: {
        key: "multi params response",
      }
    },
  ],
  '/api/helloworld/param/#param': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      params: {
        param: 'bar',
      },
      response: {
        key: "query only response",
      }
    },
    {
      method: 'delete',
      statusCode: 200,
      waitTime: 200,
      query: {
        foo: 'value here, IM DIFFEENT!',
      },
      params: {
        param: 'param value here',
      },
      response: {
        key: "params AND query response",
      }
    },
    {
      method: 'get',
      statusCode: 200,
      waitTime: 200,
      query: {
        foo: 'value here, IM DIFFEENT!',
      },
      params: {
        param: 'param value here',
      },
      body: {
        baz: "still a different value",
      },
      response: {
        key: "params, query, body response",
      }
    },
  ]
};
