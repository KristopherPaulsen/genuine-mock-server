const { init } = require('../../mockServer/MockingBird.js');

init({
  port: 8080,
  pathToFiles: 'spec/integration/Mocks',
  filePattern: '*.js', // whatever file extension you want to target
});
