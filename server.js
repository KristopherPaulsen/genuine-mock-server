const { init } = require('./mockServer/MockingBird.js');

init({
  port: 8080,
  pathToFiles: "./Mocks",
  filePattern: "*.json",
});
