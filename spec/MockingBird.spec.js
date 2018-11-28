const {
  hashToColon,
  getMockStrategy,
  normalizeMocks,
  areEqual,
  toPathMockMap,
  getCombinedMocks,
  getSlurpedMocks,
  getSuppliedMocks,
} = require('../mockServer/MockingBird.js');

// hashToColon
// regexes
// globs from express

describe('toPathMockMap()', () => {

  it('should build simple map', () => {
    const rawMocks = [
      {
        request: {
          path: '/api/example/param/:param',
          method: 'get',
          body: {},
          query: {},
          params: {},
        },
        response: {
          data: {},
          waitTime: 0,
          statusCode: 200,
          data: {
            "key": "no params, no body, no query response"
          }
        }
      }
    ];

    expect(toPathMockMap(rawMocks)).toEqual({
      "/api/example/param/:param": [
        {
          request: {
            path: '/api/example/param/:param',
            method: 'get',
            body: {},
            query: {},
            params: {},
          },
          response: {
            data: {},
            waitTime: 0,
            statusCode: 200,
            data: {
              "key": "no params, no body, no query response"
            }
          }
        }
      ]
    });
  });

  it('should convert all requests for the given path to a "request-map" with double in same method / path', () => {
    const rawMocks = [
      {
        request: {
          path: "/api/example",
          method: 'get',
        },
        response: {
          statusCode: 200,
          waitTime: 0,
          data: {
            key: "no params, no body, no query response",
          }
        }
      },
      {
        request: {
          path: "/api/example/param/:param",
          method: 'get',
          params: {
            foo: 'bar',
            baz: 'boop',
          },
        },
        response: {
          statusCode: 200,
          waitTime: 0,
          data: {
            key: "multi-param",
          }
        }
      },
      {
        request: {
          path: "/api/example/param/:param",
          method: 'get',
          params: {
            foo: 'bar'
          },
        },
        response: {
          statusCode: 200,
          waitTime: 0,
          data: {
            key: "single param",
          }
        }
      },
    ];

    expect(toPathMockMap(rawMocks)).toEqual({
      "/api/example": [
        {
          request: {
            path: "/api/example",
            method: 'get',
          },
          response: {
            statusCode: 200,
            waitTime: 0,
            data: {
              key: "no params, no body, no query response",
            }
          }
        },
      ],
      "/api/example/param/:param": [
        {
          request: {
            path: "/api/example/param/:param",
            method: 'get',
            params: {
              foo: 'bar',
              baz: 'boop',
            },
          },
          response: {
            statusCode: 200,
            waitTime: 0,
            data: {
              key: "multi-param",
            }
          }
        },
        {
          request: {
            path: "/api/example/param/:param",
            method: 'get',
            params: {
              foo: 'bar'
            },
          },
          response: {
            statusCode: 200,
            waitTime: 0,
            data: {
              key: "single param",
            }
          }
        }
      ]
    });
  });
});

describe('areEqual()', () => {
  it('returns true when exact match', () => {
    const result = areEqual({
      matchType: 'exact',
      expected: {
        body: {
          key: 'value',
        }
      },
      recieved: {
        body: {
          key: 'value',
        }
      }
    });

    expect(result).toBe(true);
  });

  it('returns false when NOT exact match', () => {
    const result = areEqual({
      matchType: 'exact',
      expected: {
        body: {
          key: 'value',
        }
      },
      recieved: {
        body: {
          key: 'wrong value',
        }
      }
    });

    expect(result).toBe(false);
  });

  it('returns true when matches based on schema', () => {
    expect(areEqual({
      matchType: 'schema',
      expected: {
        body: {
          const: {
            key: 'value',
          }
        }
      },
      recieved: {
        body: {
          key: 'value',
        }
      }
    })).toBe(true);
  });

  it('returns false when it doesnt match based on schema', () => {
    expect(areEqual({
      matchType: 'schema',
      expected: {
        body: {
          const: {
            key: '/value',
          }
        }
      },
      recieved: {
        body: {
          key: 'value',
        }
      }
    })).toBe(false);
  });
});

describe('normalizeMocks()', () => {
  it('returns mocks with hashes replaced with :, and default values', () => {

    const expected = [
      {
        request: {
          path: "/api/helloworld/name/:name",
          method: "get",
          body: {},
          query: {},
          params: {},
          matchType: "exact"
        },
        response: {
          data: {
            key: "uri hello world!"
          },
          waitTime: 0,
          statusCode: 200
        }
      }
    ];


    const result = normalizeMocks([
      {
        request: {
          path: '/api/helloworld/name/#name',
          method: 'get'
        },
        response: {
          data: {
            'key': 'uri hello world!'
          }
        }
      }
    ]);

    expect(result).toEqual(expected);
  });

  it('returns mocks with hashes replaced with :, and default values for multiple mocks', () => {

    const result = normalizeMocks([
      {
        request: {
          path: '/api/helloworld/name/#name',
          method: 'get'
        },
        response: {
          data: {
            'key': 'uri hello world!'
          }
        }
      },

      {
        request: {
          path: "/api/helloworld/name/#name/age/#age",
          method: "get",
          body: {},
          query: {},
          params: {},
          matchType: "exact"
        },
        response: {
          data: {
            key: "uri hello world!"
          },
          waitTime: 0,
          statusCode: 200
        }
      }
    ]);

    const expected = [
      {
        request: {
          path: "/api/helloworld/name/:name",
          method: "get",
          body: {},
          query: {},
          params: {},
          matchType: "exact"
        },
        response: {
          data: {
            key: "uri hello world!"
          },
          waitTime: 0,
          statusCode: 200
        }
      },

      {
        request: {
          path: "/api/helloworld/name/:name/age/:age",
          method: "get",
          body: {},
          query: {},
          params: {},
          matchType: "exact"
        },
        response: {
          data: {
            key: "uri hello world!"
          },
          waitTime: 0,
          statusCode: 200
        }
      }
    ];

    expect(result).toEqual(expected);
  });
})

describe('getMockStrategy()', () => {
  it('returns getSlurpedMocks when no mocks are supplied, only a file path', () => {
    const mockConfig = {
      pathToFiles: '/fake/path/here'
    };

    const strategy = getMockStrategy(mockConfig);

    expect(strategy).toBe(getSlurpedMocks);
  });

  it('returns getSuppliedMocks when no file path is included', () => {
    const mockConfig = {
      mocks: [
        { value:'dummy values' }
      ]
    };

    const strategy = getMockStrategy(mockConfig);

    expect(strategy).toBe(getSuppliedMocks);
  });

  it('returns getCombinedMocks when a file path, and supplied mocks are given', () => {
    const mockConfig = {
      pathToFiles: '/fake/path/here',
      mocks: [
        { value:'dummy values' }
      ]
    };

    const strategy = getMockStrategy(mockConfig);

    expect(strategy).toBe(getCombinedMocks);
  });
});

describe('hashToColon()', () => {
  it('should replace hash with colon in simple path', () => {
    expect(hashToColon('/api/param/#param')).toEqual('/api/param/:param');
  });

  it('should replace hash with colon in route but not string pattern', () => {
    expect(hashToColon('/api/param/#param?+*/rest/of/path')).toEqual('/api/param/:param?+*/rest/of/path');
  });

  it('should replace multiples hashes with colons in simple path', () => {
    expect(hashToColon('/api/param/#param/paramtwo/#paramtwo')).toEqual('/api/param/:param/paramtwo/:paramtwo');
  });

  it('should replace multiples separated hashes with colons in simple path', () => {
    expect(hashToColon('/api/param/#param/foo/paramtwo/#paramtwo')).toEqual('/api/param/:param/foo/paramtwo/:paramtwo');
  });

  it('should not replace hashes with colons in querystring', () => {
    expect(hashToColon('/api/querystring?foo=bar&#other=thing')).toEqual('/api/querystring?foo=bar&#other=thing');
  });

  it('should replace hashes with colons path, but not in json filled query string', () => {
    expect(hashToColon(`/api/param/#param/querystring?foo='{"path":"/api/param/#param/"}'`))
      .toEqual(`/api/param/:param/querystring?foo='{"path":"/api/param/#param/"}'`);
  });

  it('should replace hashes with colons in path, but not in json filled querystring containing a querystring', () => {
    expect(hashToColon(`/api/param/#param/querystring?foo='{"path":"/api/param/#param/querystring?foo=#bar"}'`))
      .toEqual(`/api/param/:param/querystring?foo='{"path":"/api/param/#param/querystring?foo=#bar"}'`);
  });

  it('should replace hashes with colons in path, but not in json filled query string that is also uri encoded', () => {
    expect(hashToColon(`/api/param/#param/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`))
      .toEqual(`/api/param/:param/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`);
  });

  it('should replace hashes with colons in uriEncoded path, but not in json filled query string that is also uri encoded', () => {
    expect(hashToColon(`/api/param%20%20/#param%20%20/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`))
      .toEqual(`/api/param%20%20/:param%20%20/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`);
  });

  it('should replace hashes with colons in uriEncoded path but not in json filled query string that is also uri encoded', () => {
    expect(hashToColon(`/api/param%20%20/#param%20%20/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`))
      .toEqual(`/api/param%20%20/:param%20%20/querystring?foo='%7B%22path%22:%22/api/param/#param/querystring?foo=#bar%22%7D'`);
  });

  it('should replace hashes with colons in uriEncoded path but not in json filled query string that is also encodeURIComponent', () => {
    expect(hashToColon(`/api/param%20%20/#param%20%20/querystring?foo%253D'%257B%2522path%2522%253A%2522%252Fapi%252Fparam%252F%2523param%252Fquerystring%253Ffoo%253D%2523bar%2522%257D'`))
      .toEqual(`/api/param%20%20/:param%20%20/querystring?foo%253D'%257B%2522path%2522%253A%2522%252Fapi%252Fparam%252F%2523param%252Fquerystring%253Ffoo%253D%2523bar%2522%257D'`)
  });

});
