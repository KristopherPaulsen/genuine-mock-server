const {
  mocks,
  flatMocks,
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

    const key1 = toKey(queryOne, paramsOne, bodyOne);

    const key2 = toKey(queryTwo, paramsTwo, bodyTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different group of objects, with DIFFERENT values, to non-equal strings', () => {

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

    const paramsTwoWithDifferentValues = {
      someOtherFakeKey: 'oh no, a different value',
    };

    const bodyTwo = {
      stillfake: 'stillanothervalue',
    };

    const key1 = toKey(queryOne, paramsOne, bodyOne);

    const key2 = toKey(queryTwo, paramsTwoWithDifferentValues, bodyTwo);

    expect(key1).not.toEqual(key2);
  });

  it('should convert different objects, with NO values, to "equal" strings', () => {

    const queryOne = {};
    const paramsOne = {};
    const bodyOne = {};
    const queryTwo = {};
    const paramsTwo = {};
    const bodyTwo = {};

    const key1 = toKey(queryOne, paramsOne, bodyOne);
    const key2 = toKey(queryTwo, paramsTwo, bodyTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different objects, which mirrored empty-objects, to "equal" strings', () => {

    const queryOne = {
      fakeValue: 'dummy',
    };

    const paramsOne = {};

    const bodyOne = {};

    const queryTwo = {
      fakeValue: 'dummy',
    }

    const paramsTwo = {};

    const bodyTwo = {};

    const key1 = toKey(queryOne, paramsOne, bodyOne);
    const key2 = toKey(queryTwo, paramsTwo, bodyTwo);

    expect(key1).toEqual(key2);
  });

  it('should convert different objects, which different empty-objects, to non-equal strings', () => {

    const queryDifferentValue = {
      fakeValue: 'I have a different value!',
    };

    const paramsOne = {};

    const bodyOne = {};

    const queryTwo = {
      fakeValue: 'dummy',
    }

    const paramsTwo = {};

    const bodyTwo = {};

    const key1 = toKey(queryDifferentValue, paramsOne, bodyOne);
    const key2 = toKey(queryTwo, paramsTwo, bodyTwo);

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
