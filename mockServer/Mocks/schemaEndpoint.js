module.exports = [
  {
    request: {
      path: '/api/helloworld/very-generic-schema',
      method: 'get',
      matchType: 'schema',
      schema: {
        required: ['query'],
        properties: {
          query: {
            properties: {
              somekey: {
                type: 'string',
                // this is going to match a whole-lot of things...
              }
            }
          }
        }
      }
    },
    response: {
      data: {
        'key': 'a schema matching mock endpoint! I match many things...'
      }
    }
  },

  {
    // this mock will be never get picked up, the above mock is too general...
    request: {
      path: '/api/helloworld/very-generic-schema',
      method: 'get',
      matchType: 'schema',
      schema: {
        required: ['query'],
        properties: {
          query: {
            properties: {
              somekey: {
                type: 'string',
              },
              anotherkey: {
                type: 'string',
              }
            }
          }
        }
      }
    },
    response: {
      data: {
        'key': 'a schema matching mock endpoint! I match many things...'
      }
    }
  },
];
