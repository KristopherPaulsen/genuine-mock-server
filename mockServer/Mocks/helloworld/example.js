module.exports = {
  '/api/helloworld/example': [
    {
      method: 'get',
      statusCode: 200,
      waitTime: 0,
      response: {
        "foo": "Hello world!",
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
      query: {
        param: 'foo',
        paramtwo: 'fooagain',
      },
      response: {
        key: "multi query response",
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
