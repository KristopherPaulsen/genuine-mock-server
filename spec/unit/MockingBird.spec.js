const {
  getMockStrategy,
  normalizeMocks,
  areEqual,
  toPathMockMap,
  getCombinedMocks,
  getSlurpedMocks,
  getSuppliedMocks,
} = require('../../mockServer/MockingBird.js');

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
          },
          headers: {},
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
            },
            headers: {},
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
          },
          headers: {
            'Content-Type': 'application/json'
          },
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
          },
          headers: {
            'Content-Type': 'application/json'
          },
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
          },
          headers: {
            'Content-Type': 'application/json'
          },
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
            },
            headers: {
              'Content-Type': 'application/json'
            },
          },
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
            },
            headers: {
              'Content-Type': 'application/json'
            },
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
            },
            headers: {
              'Content-Type': 'application/json'
            },
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
        schema: {
          required: ['body'],
          properties: {
            body: {
              properties: {
                key: {
                  type: 'string',
                }
              }
            }
          }
        },
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
        schema: {
          required: ['body'],
          properties: {
            body: {
              properties: {
                key: {
                  type: 'string',
                  const: 'wrongvalue',
                }
              }
            }
          }
        },
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
  it('returns array of one mock default values', () => {

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
          statusCode: 200,
          headers: {},
        }
      }
    ];

    const result = normalizeMocks([
      {
        request: {
          path: '/api/helloworld/name/:name',
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

  it('returns lowercase, normalized http method', () => {

    const result = normalizeMocks([
      {
        request: {
          path: '/api/helloworld/name/:name',
          method: 'GET'
        },
        response: {
          data: {
            'key': 'Oops, forgot to lowercase HTTP method'
          }
        }
      },
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
            key: "Oops, forgot to lowercase HTTP method"
          },
          waitTime: 0,
          statusCode: 200,
          headers: {},
        }
      },
    ];

    expect(result).toEqual(expected);
  });

  it('returns default values for multiple mocks', () => {

    const result = normalizeMocks([
      {
        request: {
          path: '/api/helloworld/name/:name',
          method: 'get'
        },
        response: {
          data: {
            'key': 'uri hello world!'
          },
          headers: {},
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
          statusCode: 200,
          headers: {},
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
          statusCode: 200,
          headers: {},
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
          statusCode: 200,
          headers: {},
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
