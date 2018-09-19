const {
  mocks
} = require('testdata.js');

const {
  toKey,
  flattenMocks,
  requestsToMap,
} = require('../mockServer/MockingBird.js');

describe('flattenMocks()', () => {
  it('should flatten array of mocks into one large mock map', () => {
    const flattenedMocks = flattenMocks(mocks);
  });
});
