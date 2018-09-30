# Genuine Mock Server

</br>
</br>

#### Table of Contents

* [An Example Repo](https://github.com/KristopherPaulsen/genuine-mock-server-helloworld)
* [Getting Started](#getting-started)
* [Overview of Mock Files](#overview-of-mock-files)
* [Adding Paths to Mocks](#adding-paths-to-mocks)

## Getting Started
1. Create a simple mock files directory
    ```bash
    mkdir mocks
    ```

2. Create a simple mock file inside `mocks/`

    ```bash
    vim mocks/example.js
    ```

   *Note: folder structure, file names, etc DO NOT MATTER.
   A file named Foobar could map to any endpoint. Naming conventions
   are entirely up to you!*

    ```javascript
    module.exports = [
        {
            path: '/api/example',
            method: 'get',
            response: {
            key: 'hello world!'
        }
    ];

    ```

3. Create a script to start your mock server

    ```bash
    vim server.js
    ```

    ```javascript

    const { init } = require('genuine-mock-server');

    init({
      port: 8080,
      pathToFiles: './mocks',
      filePattern: '*.js', // whatever file extension you want to target
    });

    ```

4. Use your prefered script watcher (We recommend nodemon)

   ```
   nodemon server.js
   ```
   or
   ```
   node server.js
   ```

5. Curl that bad-boy!

   ```bash
   curl http://localhost:8080/api/example
   ```

</br>

## Overview of Mock Files

| key        | type    | description                                          | Required                                                                  |
|------------|---------|----------------------------------------------------- |---------------------------------------------------------------------------|
| path       | string  | The endpoint base url                                | Required (but can be added in different ways, see 'adding paths to mocks' |
| method     | string  | The lowercase http method                            | optional (defaults to 'get')                                              |
| statusCode | Integer | The response code returned by server                 | optional (defaults to 200)                                                |
| waitTime   | Integer | The wait time before the mock server responds        | optional (defaults to 0)                                                  |
| params     | Object  | An object of key / value pairs for path params       | optional (key names should match param path names)                        |
| body       | Object  | An object of key / value pairs for the body request  | optional                                                                  |
| query      | Object  | An object of key / value pairs for the querystring   | optional                                                                  |
| response   | Object  | An object representing your desired response         | optional (but why wouldn't you include one?)                              |

```javascript
// Example File

module.exports = [
    {
        path: '/api/example/paramName/:paramName/querystring',
        method: 'post',
        body: {
            key: 'value'
        },
        params: {
            paramName: 'value of param'
        },
        query: {
            foo: 'bar'
        },
        response: {
          key: 'hello world!'
        }
    },
    {
      // mock file here...
    },
];
```

</br>

## Adding Paths to Mocks

### One Array of mocks for different endpoints

If you want, you can simply write out different paths by hand in each mock blob.
The ability to specificy different paths on a per-mock basis is useful if you're
building out mocks programatically, and want complete control.

```javascript
module.exports = [
    {
        path: '/api/path',
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
    {
        path: '/api/differentpath/',
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
];
```

</br>

### One array of mocks for the same endpoint

Writing out the same path over and over again is error prone, so a helper
method is included to make things easier, should you so desire.


```javascript
const { defaultPath } = require('genuine-mock-server');

module.exports = defaultPath('/api/example', [
    {
        // path gets added by defaultPath helper method
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
    {
        // path gets added by defaultPath helper method
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
]);
```

*Note: This method is mostly just a simple reduce function, but it won't clobber any
paths you HAVE defined. See below for an example*

</br>

### An array of mocks, mixed endpoints

You can, if you so desire, add the same path to all mock files, *except* for a few of them.

```javascript
const { defaultPath } = require('genuine-mock-server');

module.exports = defaultPath('/api/example', [
    {
        // path gets added by defaultPath helper method
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
    {
        // path gets added by defaultPath helper method
        method: 'get',
        query: {
          foo: 'bar',
        },
        response: {
          key: 'hello world!'
        }
    },
    {
        // path remains unchanged by helper method
        path: '/api/alreadydefined/'
        method: 'get',
        response: {
          key: 'hello world!'
        }
    },
]);
```
