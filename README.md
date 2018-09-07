#----------------------------------------------------------------------------------
# Mock Server: Overview
#----------------------------------------------------------------------------------

MockingBird.js introduces mocking of api endpoints (internal AND external), while
allowing developers to use Axios, or command line tools to interact with the mock
server. All requests using axios are re-routed through the server (when start:mock is ran), allowing for
mocking to be abstracted away.

Features:
  1) Mock external endpoints
  2) Mock Internal endpoints
  3) Query String endpoints can be mocked
  4) "WaitTime" can be introduced into responses
  5) Error codes can be included (Need a 404? Worry no more!)
  6) The mock server can be accessed on the command line
  7) Unit Tests no longer require the entire mocking of endpoints, just individual ones.
  8) The old user-api mocking, and this new mock, use separate instances of Axios,
    so no backwards changes need to be made. Both run in parallel.
  9) Endpoints are consumed and built programatically, so minimal developer interaction
     is needed
 10) The same mock files can be used by unit tests, and the mock Server. Write once,
     use Ad Infinium

#----------------------------------------------------------------------------------
# Getting Started
#----------------------------------------------------------------------------------

1) npm run start:mock

2) curl http://localhost:8080/api/helloworld/example

3) For examples of each type of endpoint, look inside:

   mockServer/Mocks/api/helloWorld

#----------------------------------------------------------------------------------
# Creating a standard mock endpoint
#----------------------------------------------------------------------------------

1) Create a file inside mockServer/Mocks/

2) file names must end in .json.

3) Folder name-scheme should roughly follow the api path
   (for developer convenience, the server DOES NOT really on folder names, it's just a convention)

4) Each endpoint gets one mock file (but a mockfile can define multiple http methods per endpoint)

#----
# Ex)
#----

  file: mockSever/Mocks/api/domains.json

  {
    "path": "/api/users/:userId/domains",
    "methods": {
      "get": {
        "response": {
          "key": "This is the get response!"
        }
      },
      // put here
      // delete here
      // etc
    }
  }

  curl http://localhost:8080/api/users/:userId/domains

#----------------------------------------------------------------------------------
# Creating a mock endpoint for querstring urls
#----------------------------------------------------------------------------------

Creating an endpoint for urls which should be mocked with querystrings
is almost exactly the same

1) Create a file inside mockServer/Mocks/

2) file names must end in .json.

3) Folder name-scheme should roughly follow the api path
   (for developer convenience, the server DOES NOT really on folder names)

#----
# Ex)
#----

    file: mockSever/Mocks/api/domains.json

    {
      "path": "/api/users/:userId/domains?name=foobar",  <----- include querystring in path
      "methods": {
        "get": {
          "response": {
            "key": "This is the get response!"
          }
        },
      }
    }

    curl http://localhost:8080/api/users/123/domains?name=foobar

#----------------------------------------------------------------------------------
# Features of the mock files
#----------------------------------------------------------------------------------

Mock files provide various convience keys, to allow for easier development

#----
# Ex)
#----

  {
    "path": "/api/helloworld/param/:param/second/#second", <---- Multiple path paramaters are permitted (:param or #param)
    "methods": {
      "get": {               <------- get, post, put, patch, delete, head are supported
        "statusCode": 200,   <------- all status codes are supported
        "waitTime": 500,     <------- waitime (ms) can be included to artificially increase response time
        "response": {
          "key": "This is the get response!"
        }
      },
    }
  }

  curl http://localhost:8080/api/helloworld/param/:param/second/#second


#----
# Ex)
#----

  path parameters can also be mixed with query string endpoints

  {
    "path": "/api/helloworld/param/:param/queryendpoint?name=100",
      "methods": {
        "get": {
          "response": {
            "key": "This is the get querystring / path param response"
          }
        }
      }
  }

  curl http://localhost:8080/api/helloworld/param/:param/queryendpoint?name=100
