# Genuine Mock Server

</br>
</br>

#### Table of Contents

* [An Example Repo](https://github.com/KristopherPaulsen/genuine-mock-server-helloworld)
* [Getting Started](#getting-started)
* [Overview of Mock Files](#overview-of-mock-files)
* [Overview of Initizalation Script](#overview-of-initialization-script)
* [Building the mock server using slurp mode](#building-the-mock-server-using-slurp-mode)
* [Adding Paths to Mocks](#adding-paths-to-mocks)
* [How, Query, Param and Body work in mock files](#how-query-param-and-body-work-in-mock-files)

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
        request: {
          method: 'get',
          path: '/api/helloworld/simple',
        },
        response: {
          data: {
            'key': 'Hello World!',
          }
        },
      },
    ];

    init({
      port: 8080,
      mocks: mocks,
    }
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
        request: {
          method: 'get',
          path: '/api/helloworld/simple',
        },
        response: {
          data: {
            'key': 'Hello World!',
          }
        },
      },
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
   curl http://localhost:8080/api/helloworld/simple
   ```

</br>

## Overview of Mock Files

```javascript
module.exports = [
  {
    request: {
      // ...
    },
    response: {
      // ...
    },
  },
]
```

#### Request Blob

| Key    | Type   | Description                                         | Required                   |
|--------|--------|-----------------------------------------------------|----------------------------|
| path   | String | The api endpoint path (not including querystring)   | required                   |
| method | String | The http method                                     | optional (defaults to GET) |
| params | Object | An object of key / value pairs for path params      | optional (defaults to {})  |
| body   | Object | An object of key / value pairs for the body request | optional (defaults to {})  |
| query  | Object | An object of key / value pairs for the querystring  | optional (defaults to {})  |

#### Response Blob

| Key        | Type    | Description                                                         | Required                                    |
|------------|---------|---------------------------------------------------------------------|---------------------------------------------|
| waitTime   | Integer | The time in milliseconds the mockserver will wait before responding | optional (defaults to 0)                    |
| statusCode | Integer | The http status code in the response                                | optional (defaults to 200)                  |
| data       | Object  | The data that will be returned in the response from the mock server | optional (by why would you leave it blank?) |

</br>

## Overview of initialization script

```
const { init } = require('genuine-mock-server');

init({
  port: 8080,
  pathToFiles: './mockServer/Mocks',
  filePattern: '*.js', // whatever file extension you want to target
  mocks: [
    {
      // ... stuff here
    }
  ]
});
```

| Key         | Type    | Description                                                                                   | Required                                         |
|-------------|---------|-----------------------------------------------------------------------------------------------|--------------------------------------------------|
| port        | Integer | The port number for the mock server                                                           | required                                         |
| pathToFiles | String  | The path to the top-level folder containing mock files                                        | required (only if 'mocks' is not included)       |
| filePattern | String  | The file pattern / file extension to be slurped up by the mock server                         | optional                                         |
| mocks       | Array   | An array of supplied mock objects. Useful if you want to supply programatically created mocks | required (only if 'pathToFiles' is not included) |

<br>

### Using mocks, slurped mocks, or both

You can use both mock files defined inside a mock folder,
or programatically added mock files, or both!

```
// only slurp mocks are added, since the other keys have been ommitted

const { init } = require('genuine-mock-server');

init({
  port: 8080,
  pathToFiles: './mocks',
  filePattern: '*.js'
});
```

<br>


```
// only provided mocks are added, since the other keys have been ommited

const { init } = require('genuine-mock-server');

    const mocks = [
      {
        request: {
          method: 'get',
          path: '/api/helloworld/simple',
        },
        response: {
          data: {
            'key': 'Hello World!',
          }
        },
      },
    ];

    init({
      port: 8080,
      mocks: mocks,
    });
```

<br>


```
// Here, both provided mocks, AND slurped mocks are used

const { init } = require('genuine-mock-server');

    const mocks = [
      {
        request: {
          method: 'get',
          path: '/api/helloworld/simple',
        },
        response: {
          data: {
            'key': 'Hello World!',
          }
        },
      },
    ];

    init({
      port: 8080,
      mocks: mocks,
      pathToFiles: './mockServer/Mocks',
      filePattern: '*.js', // whatever file extension you want to target
    });
```

*Note: Whichever method you choose is up to you. Provided
mocks are added first, then slurped mocks.


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

module.exports = defaultPath('/api/helloworld/defaultpath/', [
  {
    request: {
     // default path gets added automagically
      method: 'get',
    },
    response: {
      data: {
        'key': 'I use the default path',
      }
    },
  },

  {
    request: {
     // default path gets added automagically
      method: 'delete',
    },
    response: {
      data: {
        'key': 'I use the default path as well!',
      }
    },
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

module.exports = defaultPath('/api/helloworld/defaultpath/', [
  {
    request: {
     // default path gets added automagically
      method: 'get',
    },
    response: {
      data: {
        'key': 'I use the default path',
      }
    },
  },

  {
    request: {
     // default path gets added automagically
      method: 'delete',
    },
    response: {
      data: {
        'key': 'I use the default path as well!',
      }
    },
  },

  {
    request: {
      path: '/api/helloworld/notdefaultpath' // Since the path is defined, it is NOT overriden
      method: 'delete',
    },
    response: {
      data: {
        'key': 'My path was defined, so I wont be overriden',
      }
    },
  },
]);
```

## How Query Param and Body work in mock files

```javascript
module.exports = [
  {
    request: {
      query: {
        // ...
      },
      body: {
        // ...
      },
      params: {
        // ...
      }
    },
    response: {
      // ...
    },
  },
]
```

Genuine Mock server follows a simple strategy for mocking files. `Request` represents
any given http request sent to the server, with a given set of paramaters. Any request
that exactly matches these paramaters will return the data supplied in `response`.


### Query Example

Lets say you wanted to mock any GET request to `/api/helloworld/people?name=jimmy`.
Your mock file would look like

```javascript
module.exports = [
  {
    request: {
      path: '/api/helloworld/people'
      query: {
        name: 'jimmy', // A GET request to '/api/helloworld/people?name=jimmy', would match this request
      },
    },
    response: {
      data: {
        someKey: "I am the get querystring example response!"
      }
    },
  },
]

// Example semi-psuedocode axios

axios.get('/api/helloworld/people?name=jimmy');

// Example response

{
  someKey: "I am the get querystring example response!"
}
```

### Path Example

Lets say you wanted to mock any POST request to `/api/helloworld/person/:name`,
where the `:name` is equal to 'jimmy'

Your mock file would look like:

```javascript
module.exports = [
  {
    request: {
      path: '/api/helloworld/person/:name'
      path: {
        name: 'jimmy', // A request to '/api/person/jimmy' would match this request!
      },
    },
    response: {
      data: {
        someKey: "I am the path param example response!"
      }
    },
  },
]

// Example semi-psuedocode axios

axios.post('/api/helloworld/person/jimmy');

// Example response

{
  someKey: "I am the path param example response!"
}

```

### Body Example

Lets say you wanted to mock a POST request to `/api/helloworld/people`,
with a json body of `{ name: 'jimmy' }`

Your mock file would look like

```javascript
module.exports = [
  {
    request: {
      path: '/api/helloworld/person'
      body: {
        name: 'jimmy', // A POST request to the above path with the given body would match this request!
      },
    },
    response: {
      data: {
          someKey: "I am the Body example response!"
      }
    },
  },
]

// Example semi-psuedocode axios

axios.post('/api/helloworld/person', {
  name: 'jimmy',
});

// Example response

{
  someKey: "I am the body example response!"
}
```

### Mixed Example

Lets say you wanted to mock any POST request to `/api/helloworld/people/:name/filter?age=28`,
with a path param of `{ name: 'jimmy' }`, and a json body of `{ occupation: 'teacher' }`

Your mock file would look like:

```javascript
module.exports = [
  {
    request: {
      path: '/api/helloworld/people/:name/filter',
      query: {
        age: '28',
      },
      params: {
        name: 'jimmy'
      },
      body: {
        occupation: 'teacher',
      },
    },
    response: {
      data: {
        someKey: "I am the mixed request example data"
      }
    },
  },
]

// Example semi-psuedocode axios

axios.post('/api/helloworld/people/jimmy/filter?age=28', {
  occupation: 'teacher',
});

// Example response

{
  someKey: "I am the mixed request example data"
}
```


### Further Reading and Examples

For more information on what the mock files look like with a mix of path params, querystrings, and request bodies,
be sure to check out the example repo (Sometimes an example is worth a thousand words!)
* [An Example Repo](https://github.com/KristopherPaulsen/genuine-mock-server-helloworld)
