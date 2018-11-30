const axios = require('axios');
const { init } = require('../../mockServer/MockingBird.js');
const { spawnServer } = require('./initTestServer.js');

//const testUrl = `http://localhost:8080/api/helloworld/suppliedmock/first`;
//spawnServer({
  //serverPath: './mocksOnlyServer.js',
  //testUrl,
//})
//.catch(error => console.log(error))
//.then(foo => {
  //axios.get(testUrl).then(data => console.log('yes!'))
//})

describe('init()', () => {
  it('returns supplied mock data for first mock', async () => {
    const testUrl = `http://localhost:8080/api/helloworld/suppliedmock/first`;
    const server  = await spawnServer({
      serverPath: './spec/integration/mocksOnlyServer.js',
      testUrl,
    });

    const { data } = await axios.get(testUrl);

    expect(data).toEqual({
      key: 'I am the first supplied mock'
    });

    server.kill();
  });

  it('returns supplied mocks data for the second mock', async () => {
    const testUrl = `http://localhost:8080/api/helloworld/suppliedmock/second`;
    const server  = await spawnServer({
      serverPath: './spec/integration/mocksOnlyServer.js',
      testUrl,
    });

    const { data } = await axios.get(testUrl);

    expect(data).toEqual({
      key: 'I am the second supplied mock'
    });

    server.kill();
  });
});
