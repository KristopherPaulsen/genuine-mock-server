module.exports = [
  {
    path: '/api/helloworld/example',
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    response: {
      "foo": "Hello world!",
    }
  },
  {
    path: '/api/helloworld/querystring',
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    query: {
      bar: 'foo'
    },
    response: {
      key: "single query response",
    }
  },
  {
    path: '/api/helloworld/querystring',
    method: 'get',
    statusCode: 200,
    waitTime: 0,
    query: {
      bar: 'foo',
      bar2: 'fooagain',
    },
    response: {
      key: "multi query response",
    }
  },
  {
    path: '/api/helloworld/paramName/#paramName',
    method: 'get',
    statusCode: 200,
    waitTime: 200,
    params: {
      paramName: 'bar',
    },
    response: {
      key: "single param only response",
    }
  },
  {
    path: '/api/helloworld/paramName/#paramName',
    method: 'get',
    statusCode: 200,
    waitTime: 200,
    query: {
      foo: 'value here, IM DIFFEENT!',
    },
    params: {
      paramName: 'param value here',
    },
    body: {
      baz: "still a different value",
    },
    response: {
      key: "params, query, body response",
    }
  },
];
