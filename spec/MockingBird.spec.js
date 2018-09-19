const {
  mocks,
  flatMocks,
  hashToColon,
  mockRequestMap,
} = require('./testData.js');

const {
  toKey,
  flattenMocks,
  requestsToMap,
} = require('../mockServer/MockingBird.js');

describe('flattenMocks()', () => {
  it('should flatten array of different endpoint mocks into one large mock map', () => {
    expect(flattenMocks(mocks)).toEqual(flatMocks);
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
      someOtherFakeKey: 'oh no, a different value',
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
    const queryTwo = { fakeValue: 'dummy', };
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

  it('should convert different objects (with same values) but the values are on different types (body, query, param), to non-equal strings', () => {


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

  it('should convert different objects (with same values) but the values are on different types (body, query, param), to non-equal strings', () => {

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
});

describe('requestsToMap()', () => {
  it('should convert all requests for the given path to a "request-map"', () => {
    const mockRequestFlatMocks = {
      '/api/example/param/:param': [
        {
          method: 'get',
          statusCode: 200,
          waitTime: 0,
          response: {
            key: "no params, no body, no query response",
          }
        },
        {
          method: 'delete',
          statusCode: 200,
          waitTime: 0,
          params: {
            param: 'param value here',
          },
          response: {
            key: "only params response",
          }
        },
      ],
      '/api/example/otherparam/:param': [
        {
          method: 'delete',
          statusCode: 200,
          waitTime: 0,
          query: {
            foo: 'another value',
          },
          params: {
            param: 'param value here',
          },
          response: {
            key: "params, query response",
          }
        },
      ]
    };

    expect(requestsToMap(mockRequestFlatMocks)).toEqual(mockRequestMap);

  });
});
