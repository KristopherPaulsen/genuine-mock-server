# Genuine Mock Server

[An Example Repo](https://github.com/KristopherPaulsen/genuine-mock-server-helloworld)
[Getting Started](#getting-started)
[Overview of Mock Files](#overview-of-mock-files)

## Getting Started
1. Create a simple mock files directory
    ```
    mkdir mocks
    ```

2. Create a simple mock file inside `mocks/`

    ```
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

    ```
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
   nodemon server.js` or `node server.js
   ```

5. Curl that bad-boy!

   ```
   curl http://localhost:8080/example
   ```

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

## Adding Paths to Mocks
##### Adding the same path multiple times #foo

Mock files are entirely unopinionated. You can add different mocks for entirely different paths, if you so desire.
You can also keep mock files on a one-basepath-to-file stategy. In this case, instead of writing out paths over and over,
you can:


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


#### Adding the same path multiple times, except for one

You can, if you so desire, add the same path to all mock files, *except* for a few of them.
Probably best to avoid if you're building our mock files manually, as that increases the chances
of confusion when reading them.

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
            path: '/api/alreadyDefined' // pre-defined path is ignored by helper function
            method: 'get',
            response: {
              key: 'hello world!'
            }
        },
    ]);
```

