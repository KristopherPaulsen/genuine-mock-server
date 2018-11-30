const { defaultPath } = require('../MockingBird.js');

module.exports = defaultPath('/api/helloworld/defaultpath/', [
  {
    request: {
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
      method: 'delete',
      path: '/api/helloworld/alreadydefined/'
    },
    response: {
      data: {
        'key': 'My path was defined, so I wont be overriden',
      }
    },
  },
]);
