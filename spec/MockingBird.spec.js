const {
  toKey,
  toRequestMap
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
