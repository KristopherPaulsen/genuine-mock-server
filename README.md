# Getting Started

1. Create a simple mock files directory

    `mkdir mocks`


2. Create a simple mock file inside `mocks/`

   `vim mocks/example.json`

   *Note folder structure, file names, etc DO NOT MATTER.
   A file named Foobar could map to any endpoint. Naming conventions
   are entirely up to you!*

```javascript
{
  "path": "/example",
  "methods": {
    "get": {
      "response": {
        "key": "This is the get response!"
      }
    }
  }
}

```

3. Create a script to start your mock server

    `vim server.js`

```javascript

const { init } = require('genuine-mock-server');

init({
  port: 8080,
  pathToFiles: './mocks',
  filePattern: '*.json',
});

```


Use your prefered script watcher (We recommend nodemon)

4. `nodemon server.js` or `node server.js`

5. `curl http://localhost:8080/example`


# Overview of Mock files


Each endpiont should get one respective mock file. This file
describes the various http methods that can be used, and their respective responses

##### Path
The endpoint URL. Can include multiple paramaters, querystrings, or any combination!

(See examples below)

##### methods
An object of keys (each an `http` method), describing the various responses

##### statusCode
The status code of the returned http response. All status codes are supported!

##### waitTime
The wait time (milliseconds) before the server responds. Useful for including artificial delays

##### response
Everything inside this key will be the response given by the server in `json` format.

#### Path paramater endpoint

```javascript
  {
    "path": "/example/param/:param/second/#second",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
```

  `curl http://localhost:8080/example/param/123/second/1234`


#### query string endpoint

```javascript
  {
    "path": "/querystring?name=foo",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
```

  `curl http://localhost:8080/querystring?name=foo`

#### query string and path parameter endpoint
```javascript
{
    "path": "/pathparam/:param/querystring?name=foo",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}
```

`curl http://localhost:8080/pathparam/123/queryString?name=foo`


#### query string with parameters

*This framework allows for parameters in the querystring itself,
so you can catch any value for a given key*

###### querysring placeholders
`:foo` is a placeholder, but you can use `:anyWordHere`


```javascript
{
    "path": "/pathparam/:param/querystring?name=:foo&age=28",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}
```

`curl http://localhost:8080/pathparam/123/querystring?name=whatever&age=28`


##### IMPORTANT !!!!
If you use a `somekey=:param` in your query string, avoid creating endpoints that also
explicitly define a value for that `somekey=valueHere`, otherwise the server will incorrectly respond
with whichever endpoint happens to come up first.


*Will have a conflict*
``` javascript
{
    "path": "/pathparam/:param/querystring?somekey=:foo&age=28",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}

// some other file somewhere, nows theres a conflict
{
    "path": "/pathparam/:param/querystring?somekey=valueHere&age=28",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}

```

*No conflicts, different set of key-values*
```javascript
{
    "path": "/pathparam/:param/querystring?somekey=:foo&age=28",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}

// some other file somewhere, but no conflicts due to separate key-value lists
{
    "path": "/pathparam/:param/querystring?somekey=:foo&age=28&anotherKey=value",
    "methods": {
      "get": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the get response!"
        }
      },
      "delete": {
        "statusCode": 200,
        "waitTime": 0,
        "response": {
          "key": "This is the delete response!"
        }
      }
    }
  }
}
```
