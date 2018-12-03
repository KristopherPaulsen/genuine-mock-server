const http = require('http');

const httpGetPromise = function(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }

      response.on('data', () => resolve(response.headers));
    });

    request.on('error', (err) => reject(err))
  })
};

module.exports = { httpGetPromise };
