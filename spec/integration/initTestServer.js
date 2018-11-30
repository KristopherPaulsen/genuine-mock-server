const spawn = require('child_process').spawn;
const axios = require('axios');

function spawnServer({ serverPath }) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', [serverPath]);

    server.stdout.pipe(process.stdout)
    server.stderr.pipe(process.stderr)

    server.on('error', reject)

    server.stdout.on('data', function (data) {
      resolve(server)
    });
  });
}

exports.spawnServer = spawnServer;
