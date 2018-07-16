const config = {
  user: 'nagger',
  password: '123456',
  token: null,
  salt: '812032',

  authAPIs: [
    {
      url: '/blog',
      methods: ['post', 'put', 'delete'],
    },
  ],
}
module.exports = config
