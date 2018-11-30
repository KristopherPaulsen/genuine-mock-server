const axios = require('axios');
const { init } = require('../../mockServer/MockingBird.js');
const { spawnServer } = require('./initTestServer.js');

describe('init() for supplied mocks, but not mock file slurping', () => {
  const localhostAxios = axios.create({ baseURL: 'http://localhost:8080'} );

  it('creates a mock server and serves mock data when given no files, but supplied mocks', async () => {
    const server  = await spawnServer({
      serverPath: './spec/integration/mocksOnlyServer.js',
    });

    try {
      const { data } = await localhostAxios.get('/api/helloworld/suppliedmock/first');

      expect(data).toEqual({
        key: 'I am the first supplied mock'
      });
    } catch (error) {
      console.log(error);
    } finally {
      server.kill();
    }
  });

  it('creates a mock server and serves the second mock data when given no files, but supplied mocks', async () => {
    const server  = await spawnServer({
      serverPath: './spec/integration/mocksOnlyServer.js',
    });

    try {
      const { data } = await localhostAxios.get('api/helloworld/suppliedmock/second');

      expect(data).toEqual({
        key: 'I am the second supplied mock'
      });
    } catch(error) {
      console.log(error);
    } finally {
      server.kill();
    }
  });
});

describe('init() for file slurping, but no supplied mocks', () => {
  const localhostAxios = axios.create({ baseURL: 'http://localhost:8080'} );

  it('creates a mock server, and serves up the hello world mock data', async () => {
    const server  = await spawnServer({
      serverPath: './spec/integration/mocksOnlyServer.js',
    });

    try {
      const { data } = await localhostAxios.get('api/helloworld/suppliedmock/second');

      expect(data).toEqual({
        key: 'I am the second supplied mock'
      });
    } catch(error) {
      console.log(error);
    } finally {
      server.kill();
    }
  });
});
