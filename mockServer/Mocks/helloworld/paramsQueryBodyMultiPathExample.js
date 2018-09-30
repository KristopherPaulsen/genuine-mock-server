module.exports = [
  {
    path: '/api/helloworld/multipath',
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
    path: '/api/helloworld/someparam/#someparam', // params can use # or : as delimiter
    method: 'get',
    statusCode: 200,
    waitTime: 200,
    params: {
      someparam: 'bar',
    },
    response: {
      key: "single param only response",
    }
  },
  {
    path: '/api/helloworld/someparam/:someparam', // params can use # or : as delimiter
    method: 'get',
    statusCode: 200,
    waitTime: 200,
    query: {
      foo: 'bar',
    },
    params: {
      someparam: 'bar',
    },
    body: {
      baz: "foo",
    },
    response: {
      key: "params, query, body response",
    }
  },
];
