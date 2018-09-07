const {
  areEquivalent,
  queryString,
  parseQueryString,
  paramsToRegex,
  toBasePath,
  rawMocks,
  toQueryMocks,
  toQueryPathMap,
  getPartitionedMocks,
  toFinalQueryPathMap,
} = require('../mockServer/MockingBird.js');

const {
  mocks,
  nonQueryMocks,
  finalQueryPathMap
} = require('./testData.js');

describe('areEquivalent()', () => {
  it('should consider query objects with same values equivalent', () => {
    const queryObj1 = {
      foo: 'bar',
    }

    const queryObj2 = {
      foo: 'bar',
    }

    expect(areEquivalent(queryObj1, queryObj2))
      .toBe(true);
  });

  it('should consider query objects with multiple, equal values equivalent', () => {
    const queryObj1 = {
      foo: 'bar',
      baz: 'dummy',
    };

    const queryObj2 = {
      foo: 'bar',
      baz: 'dummy',
    };

    expect(areEquivalent(queryObj1, queryObj2))
      .toBe(true);
  });

  it('should consider subset objects are NOT equivalent', () => {
    const queryObj1 = {
      foo: 'bar',
      baz: 'dummy',
    };

    const queryObj2 = {
      foo: 'bar',
    };

    expect(areEquivalent(queryObj1, queryObj2))
      .toBe(false);
  });

  it('should consider objects with same values, but params in querystring, as equivalent', () => {
    const queryObj1 = {
      foo: 'bar',
    };

    const queryObj2 = {
      foo: ':someParam',
    };

    expect(areEquivalent(queryObj1, queryObj2))
      .toBe(true);
  });

  it('should consider objects with multiple values, but params in querystring, as equivalent', () => {
    const queryObj1 = {
      foo: 'bar',
      baz: 'dummy',
    };

    const queryObj2 = {
      foo: ':someParam',
      baz: 'dummy',
    };

    expect(areEquivalent(queryObj1, queryObj2))
      .toBe(true);
  });
});

describe('toBasePath()', () => {
  it('should return base path, without question mark or querystring', () => {
    expect(toBasePath('/api/base/name?foo=200'))
      .toEqual('/api/base/name');
  });

  it('should return param base path, without question mark or querystring', () => {
    expect(toBasePath('/api/base/param/:param/second/#second/name?foo=200'))
      .toEqual('/api/base/param/:param/second/#second/name');
  });

  it('should return base path', () => {
    expect(toBasePath('/api/base/name?foo=200&bar=200'))
      .toEqual('/api/base/name');
  });

  it('should return base path if no query string', () => {
    expect(toBasePath('/api/base/'))
      .toEqual('/api/base/');
  });
});

describe('paramsToRegex()', () => {
  it('should return regex that matches path with path-paramaters', () => {
    const regex = paramsToRegex('/api/users/:userId/');
    expect('/api/users/123/'.match(regex)).toBeTruthy();
  });

  it('should return regex that matches path with multiple path-paramaters', () => {
    const regex = paramsToRegex('/api/users/:userId/name/#name/');
    expect('/api/users/123/name/Jimmy/'.match(regex)).toBeTruthy();
  });

  it('should not match incorrect path', () => {
    const regex = paramsToRegex('/api/users/:userId/name/#name/');
    expect('/api/users/123/age/Jimmy/'.match(regex)).toBeFalsy();
  });

  it('should not match malformed path', () => {
    const regex = paramsToRegex('/api/users/:userId/name/:name/');
    expect('/api/users//'.match(regex)).toBeFalsy();
  });
});

describe('queryString()', () => {
  it('should match query string with one param', () => {
    expect('/api/base/item?foo=100'.match(queryString)[1])
      .toBeTruthy();
  });

  it('should match query string with two params', () => {
    expect('/api/base/item?foo=100&bar=dummy'.match(queryString)[1])
      .toBeTruthy();
  });

  it('should return query string with two params', () => {
    expect('/api/base/item?foo=100&bar=dummy'.match(queryString)[1])
      .toEqual('foo=100&bar=dummy');
  });

  it('should return query string with one param', () => {
    expect('/api/base/item?bar=dummy'.match(queryString)[1])
      .toEqual('bar=dummy');
  });

  it('should return query string with one param when path has params', () => {
    expect('/api/base/param/:param/second/#second/item?bar=dummy'.match(queryString)[1])
      .toEqual('bar=dummy');
  });
});

describe('parseQueryString()', () => {
  it('should return empty object if empty query string (same as Express)', () => {
    expect(parseQueryString('api/base/'))
      .toEqual({});
  });

  it('should return object with one key-value pair', () => {
    const result = parseQueryString('api/base/item?foo=100');
    expect(result)
      .toEqual({foo: '100'});
  });

  it('should return object with two key-value pairs', () => {
    expect(parseQueryString('api/base/item?foo=100&bar=dummy'))
      .toEqual({foo: '100', bar: 'dummy'});
  });

  it('should return object with ints coerced into strings (same as Express)', () => {
    expect(parseQueryString('api/base/item?foo=100&bar=200&baz=1337'))
      .toEqual({foo: '100', bar: '200', baz: '1337'});
  });
});

describe('toQueryMocks()', () => {

  it('should transform query Mock into array of mocks', () => {
    expect(toQueryMocks(mocks[1]))
      .toEqual([
        {
          "method": "get",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "100"
          },
          "response": {
            "key": "This is the foo=100 path-param get response"
          }
        },
        {
          "method": "put",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "100"
          },
          "response": {
            "key": "This is the foo=100 path-param put response"
          }
        },
      ]);
  });

  it('should transform query Mock into array of mocks', () => {
    expect(toQueryMocks(mocks[2]))
      .toEqual([
        {
          "method": "get",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "100"
          },
          "response": {
            "key": "This is the foo=100 get response"
          }
        },
        {
          "method": "put",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "100"
          },
          "response": {
            "key": "This is the foo=100 put response"
          }
        }
      ]);
  });

  it('should transform query Mock into array of mocks', () => {
    expect(toQueryMocks(mocks[3]))
      .toEqual([
        {
          "method": "get",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "200"
          },
          "response": {
            "key": "This is the foo=200 get response"
          }
        },
        {
          "method": "put",
          "statusCode": 200,
          "waitTime": 0,
          "query": {
            "foo": "200"
          },
          "response": {
            "key": "This is the foo=200 put response"
          }
        }
      ]);
  });
});

describe('toQueryPathMap()', () => {
  it('should create map of all supplied queryString endpoints, when supplied only query endpoint mocks', () => {
    const result = toQueryPathMap(
      mocks.filter(mock => mock.path.match(queryString))
    );

    expect(result)
      .toEqual({
        "/api/:userId/queryendpoint": [
          {
            "method": "get",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "100"
            },
            "response": {
              "key": "This is the foo=100 get response"
            }
          },
          {
            "method": "put",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "100"
            },
            "response": {
              "key": "This is the foo=100 put response"
            }
          },
          {
            "method": "get",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "200"
            },
            "response": {
              "key": "This is the foo=200 get response"
            }
          },
          {
            "method": "put",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "200"
            },
            "response": {
              "key": "This is the foo=200 put response"
            }
          }
        ],
        "/api/:userId/param/:param/queryendpoint": [
          {
            "method": "get",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "100",
            },
            "response": {
              "key": "This is the foo=100 path-param get response"
            }
          },
          {
            "method": "put",
            "statusCode": 200,
            "waitTime": 0,
            "query": {
              "foo": "100",
            },
            "response": {
              "key": "This is the foo=100 path-param put response"
            }
          },
        ]
      });
  });
});

describe('toFinalQueryPathMap', () => {
  it('should return complete pathMap, that includes endpoints with the same basepath as querystring endpoints', () => {

    const result = toFinalQueryPathMap(
      mocks,
      toQueryPathMap(mocks.filter(mock => mock.path.match(queryString)))
    );

    expect(result)
      .toEqual(finalQueryPathMap)
  });
});

describe('getPartitionedMocks', () => {
  it('should return array of completePathMap, and nonQueryMocks', () => {
    expect(getPartitionedMocks(mocks))
      .toEqual([nonQueryMocks, finalQueryPathMap]);
  });
});
