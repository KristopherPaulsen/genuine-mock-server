const {
  toKey,
  toRequestMap,
  hashToColon,
} = require('../mockServer/MockingBird.js');

describe('toRequestMap()', () => {

  it('provide defaults if requests do not', () => {
    const rawMocks = [
      [
        {},
      ]
    ];

    expect(toRequestMap(rawMocks)).toEqual({
      "": {
        "get": {
          [toKey({}, {}, {})]: {
            waitTime: 0,
            statusCode: 200,
            response: {}
          },
        },
      },
    });
  });

  it('should pre-flatten raw mocks while building map', () => {
    const rawMocks = [
      [
        {
          path: "/api/example/param/:param",
          method: 'get',
          statusCode: 200,
          waitTime: 0,
          response: {
            key: "no params, no body, no query response",
          }
        },
      ]
    ];

    expect(toRequestMap(rawMocks)).toEqual({
      "/api/example/param/:param": {
        "get": {
          [toKey({}, {}, {})]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "no params, no body, no query response"
            }
          },
        },
      },
    });
  });

  it('should convert all requests for the given path to a "request-map" with double in same method / path', () => {
    const rawMocks = [
      {
        path: "/api/example",
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        response: {
          key: "no params, no body, no query response",
        }
      },
      {
        path: "/api/example/param/:param",
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        params: {
          foo: 'bar',
          baz: 'boop',
        },
        response: {
          key: "multi-param",
        }
      },
      {
        path: "/api/example/param/:param",
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        params: {
          foo: 'bar'
        },
        response: {
          key: "single param",
        }
      },
    ];

    expect(toRequestMap(rawMocks)).toEqual({
      "/api/example": {
        "get": {
          [toKey({}, {}, {})]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "no params, no body, no query response"
            }
          },
        },
      },
      "/api/example/param/:param": {
        "get": {
          [toKey({}, {}, { foo: 'bar' })]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "single param"
            }
          },
          [toKey({}, {}, { foo: 'bar', baz: 'boop' })]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "multi-param"
            }
          },
        }
      }
    });
  });

  it('should convert all requests for the given path to a "request-map" with multiple method types', () => {
    const rawMocks = [
      {
        path: "/api/example",
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        response: {
          key: "no params, no body, no query response",
        }
      },
      {
        path: "/api/example/param/:param",
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        params: {
          foo: 'bar',
          baz: 'boop',
        },
        response: {
          key: "multi-param",
        }
      },
      {
        path: "/api/example/param/:param",
        method: 'delete',
        statusCode: 200,
        waitTime: 0,
        params: {
          foo: 'bar'
        },
        response: {
          key: "single param",
        }
      },
    ];

    expect(toRequestMap(rawMocks)).toEqual({
      "/api/example": {
        "get": {
          [toKey({}, {}, {})]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "no params, no body, no query response"
            }
          },
        },
      },
      "/api/example/param/:param": {
        "get": {
          [toKey({}, {}, { foo: 'bar', baz: 'boop' })]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "multi-param"
            }
          },
        },
        "delete": {
          [toKey({}, {}, { foo: 'bar' })]: {
            "statusCode": 200,
            "waitTime": 0,
            "response": {
              "key": "single param"
            }
          },
        },
      }
    });
  });
});


describe('toKey()', () => {
  it('should convert different group of objects, with the same values, to "equal" string', () => {

    const queryOne = {
      fakeKey: 'someValue',
    };

    const paramsOne = {
      someOtherFakeKey: 'someOtherValue',
    };

    const bodyOne = {
      stillfake: 'stillanothervalue',
    };

    const queryTwo = {
      fakeKey: 'someValue',
    };

    const paramsTwo = {
      someOtherFakeKey: 'someOtherValue',
    };

    const bodyTwo = {
      stillfake: 'stillanothervalue',
    };

    const key1 = toKey(bodyOne, queryOne, paramsOne);

    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different group of objects, with nested same values, to "equal" string', () => {

    const queryOne = {
      fakeKey: 'someValue',
      nested: {
        other: 'value'
      }
    };

    const paramsOne = {
      someOtherFakeKey: 'someOtherValue',
      nested: {
        other: 'value'
      }
    };

    const bodyOne = {
      stillfake: 'stillanothervalue',
      nested: {
        other: 'value'
      }
    };

    const queryTwo = {
      fakeKey: 'someValue',
      nested: {
        other: 'value'
      }
    };

    const paramsTwo = {
      someOtherFakeKey: 'someOtherValue',
      nested: {
        other: 'value'
      }
    };

    const bodyTwo = {
      stillfake: 'stillanothervalue',
      nested: {
        other: 'value'
      }
    };

    const key1 = toKey(bodyOne, queryOne, paramsOne);

    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different group of objects, with DIFFERENT values, to non-equal strings', () => {

    const bodyOne = {
      stillfake: 'stillanothervalue',
    };

    const queryOne = {
      fakeKey: 'someValue',
    };

    const paramsOne = {
      someOtherFakeKey: 'someOtherValue',
    };

    const bodyTwo = {
      stillfake: 'stillanothervalue',
    };

    const queryTwo = {
      fakeKey: 'someValue',
    };

    const paramsTwoWithDifferentValues = {
      someOtherFakeKey: 'a different value',
    };

    const key1 = toKey(bodyOne, queryOne, paramsOne);

    const key2 = toKey(bodyTwo, queryTwo, paramsTwoWithDifferentValues);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different group of objects, with different nested same values, to non-equal string', () => {

    const queryOne = {
      fakeKey: 'someValue',
      nested: {
        other: 'different value'
      }
    };

    const paramsOne = {
      someOtherFakeKey: 'someOtherValue',
      nested: {
        other: 'value'
      }
    };

    const bodyOne = {
      stillfake: 'stillanothervalue',
      nested: {
        other: 'value'
      }
    };

    const queryTwo = {
      fakeKey: 'someValue',
      nested: {
        other: 'value'
      }
    };

    const paramsTwo = {
      someOtherFakeKey: 'someOtherValue',
      nested: {
        other: 'value'
      }
    };

    const bodyTwo = {
      stillfake: 'stillanothervalue',
      nested: {
        other: 'value'
      }
    };

    const key1 = toKey(bodyOne, queryOne, paramsOne);

    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different objects, with NO values, to "equal" strings', () => {

    const bodyOne = {};
    const queryOne = {};
    const paramsOne = {};

    const bodyTwo = {};
    const queryTwo = {};
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);

    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different objects, which mirrored empty-objects, to "equal" strings', () => {

    const bodyOne = {};
    const queryOne = {
      fakeValue: 'dummy',
    };
    const paramsOne = {};


    const bodyTwo = {};
    const queryTwo = {
      fakeValue: 'dummy',
    };
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different objects, which different empty-objects, to non-equal strings', () => {

    const bodyOne = { place: 'holder' };
    const queryOne = {};
    const paramsOne = {};


    const bodyTwo = {};
    const queryTwo = { place: 'holder' };
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different objects (with same values) but the values are on different types (params/query), to non-equal strings', () => {


    const bodyOne = {};
    const queryOne = {};
    const paramsOne = { foo: 'bar' };

    const bodyTwo = {};
    const queryTwo = { foo: 'bar' };
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryTwo, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different objects (with same values) but the values are on different types (query/params), to non-equal strings', () => {

    const bodyOne = {};
    const queryOne = { foo: 'bar' };
    const paramsOne = {};

    const bodyTwo =  {};
    const queryTwo = {};
    const paramsTwo = { foo: 'bar' };

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryOne, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different objects (with same values) but the values are on different types (query/body), to non-equal strings', () => {

    const bodyOne   = {};
    const queryOne  = { foo: 'bar' };
    const paramsOne = {};

    const bodyTwo   = { foo: 'bar' };
    const queryTwo  = {};
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryOne, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should converty different objects (with same values) but the values are on different types (body/query), to non-equal strings', () => {

    const bodyOne   = { foo: 'bar' };
    const queryOne  = {};
    const paramsOne = {};

    const bodyTwo   = {};
    const queryTwo  = { foo: 'bar' };
    const paramsTwo = {};

    const key1 = toKey(bodyOne, queryOne, paramsOne);
    const key2 = toKey(bodyTwo, queryOne, paramsTwo);

    expect(key1).not.toEqual(key2);
  });

});

describe('hashToColon()', () => {
  it('should replace hash with colon in simple path', () => {
    expect(hashToColon('/api/param/#param')).toEqual('/api/param/:param');
  });

  it('should replace multiples hashes with colons in simple path', () => {
    expect(hashToColon('/api/param/#param/paramtwo/#paramtwo')).toEqual('/api/param/:param/paramtwo/:paramtwo');
  });

  it('should replace multiples separated hashes with colons in simple path', () => {
    expect(hashToColon('/api/param/#param/foo/paramtwo/#paramtwo')).toEqual('/api/param/:param/foo/paramtwo/:paramtwo');
  });

  it('should NOT replace hashes with colons in querystring', () => {
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
