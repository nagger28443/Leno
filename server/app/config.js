const config = {
  user: 'nagger',
  password: '123456',
  token: null,
  salt: '812032',
  secret: 'this_is_a_secret_hohoho_haha',

  authAPIs: [
    {
      url: '/blog',
      methods: ['post', 'put', 'delete'],
    },
  ],
}
module.exports = config
