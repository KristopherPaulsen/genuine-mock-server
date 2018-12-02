module.exports = [
  {
    request: {
      path: '/api/helloworld/my%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab',
      method: 'get'
    },
    response: {
      data: {
        'key': 'uri hello world!'
      }
    }
  },
]
