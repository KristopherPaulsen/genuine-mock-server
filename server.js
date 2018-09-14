const { init } = require('./mockServer/MockingBird.js');

init({
  port: 8080,
  pathToFiles: "./mockServer/Mocks",
  filePattern: "*.json",
});
