module.exports = [
  {
    request: {
      path: '/api/helloworld/very-generic-schema',
      method: 'get',
      matchType: 'schema',
      query: {
        required: ['somekey'],
        somekey: {
          type: 'string',
          //... notice no value is given, anything will match!
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
    request: {
      // You won't be able to reach this one...
      path: '/api/helloworld/schema',
      method: 'get',
      matchType: 'schema',
      query: {
        somekey: {
          const: 'valueone'
        },
        anotherkey: {
          const: 'valuetwo'
        }
      }
    },
    response: {
      data: {
        'key': 'You cant reach me, the top schema is too generic!',
      }
    }
  },
]
