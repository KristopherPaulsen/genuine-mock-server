const spawn = require('child_process').spawn;
const axios = require('axios');

function spawnServer({ serverPath, testUrl }) {
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

//async function waitForURLReachable(url, timeout = 10000) {
  //const timeoutThreshold = Date.now() + timeout

  //const id = setInterval(async () => {
    //try {
      //await axios.get(url);
      //clearInterval(id);
      //return true;
    //} catch (err) {
      //if (Date.now() > timeoutThreshold) {
        //clearInterval(id);
        //throw new Error(`URL ${url} not reachable after ${timeout}ms`)
      //}
    //}
  //}, 700);
//}

exports.spawnServer = spawnServer;
