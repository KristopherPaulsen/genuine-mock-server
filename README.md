# Genuine Mock Server

</br>
</br>

#### Table of Contents

* [An Example Repo](https://github.com/KristopherPaulsen/genuine-mock-server-helloworld)
* [Getting Started](#getting-started)
* [Building the mock server using slurp mode](#building-the-mock-server-using-slurp-mode)
* [Overview of Mock Files](#overview-of-mock-files)
* [Adding Paths to Mocks](#adding-paths-to-mocks)

## Getting Started
1. Create a script to start your mock server at the git root of your project

    ```bash
    vim server.js
    ```

    ```javascript
    // Inside server.js

    const { init } = require('genuine-mock-server');

    const mocks = [
      {
        path: '/api/helloworld/simple',
        method: 'get',
        statusCode: 200,
        waitTime: 0,
        response: {
          "key": "Hello world!",
        }
      },
    ];

    init({
      port: 8080,
      mocks: mocks,
    });
    ```

2. Use your prefered script watcher (We recommend nodemon)

   ```
   nodemon server.js
   ```
   or
   ```
   node server.js
   ```

3. Curl that bad-boy!

   ```bash
   curl 'http://localhost:8080/api/helloworld/simple'
   ```


## Building the Mock Server Using Slurp Mode

There is also a *second* way to build the mock server, and that is using 'slurp' mode.
You specify the path to the folders containing mock files, and a file-ending to slurp up
into the mock server. Slurp mode is useful if you want a file-to-endpoint naming convention
for storing your mocks.

1. Create a simple mock files directory
    ```bash
    mkdir mocks
    ```

2. Create a simple mock file inside `mocks/`

    ```bash
    vim mocks/example.js
    ```

   *Note: folder structure, file names, etc DO NOT MATTER. Files are slurped recursively.
   A file named Foobar could map to any endpoint. Naming conventions
   are entirely up to you!*

    ```javascript
    module.exports = [
        {
            path: '/api/helloworld/simple',
            method: 'get',
            response: {
              key: 'hello world!'
            }
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
   curl http://localhost:8080/api/helloworld/example
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
        path: '/api/example/someparam/:someparam/querystring',
        method: 'post',
        body: {
            key: 'value'
        },
        params: {
            someparam: 'baz'
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

### One Array of Mocks for Different Endpoints

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

### One Array of Mocks for the Same Endpoint

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
        method: 'post',
        body: {
          key: 'value',
        },
        response: {
          key: 'hello world!'
        }
    },
]);
```

*Note: This method is mostly just a simple reduce function, but it won't clobber any
paths you HAVE defined. See below for an example*

</br>

### An Array of Mocks, Mixed Endpoints

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
