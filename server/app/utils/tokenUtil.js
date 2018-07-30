const jwt = require('jsonwebtoken')
const { secret, guest } = require('../config')
const { TOKEN_INVALID, GUEST_NOT_ALLOWED } = require('../constants/codes')

const tku = {}

const authMethods = ['POST', 'PUT', 'DELETE']
const authAPIs = ['/draft', '/recycle']

tku.tokenGenerator = user => jwt.sign({ user, expiresIn: 60 * 60 }, secret)

const checkTK = token => new Promise((resolve) => {
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      resolve(TOKEN_INVALID)
    }

    const { user } = result

    if (result.expiresIn / 2 + result.iat > Date.now() / 1000) {
      resolve({ token: tku.tokenGenerator(result.user), user })
    }
    resolve({ token, user })
  })
})

tku.checkToken = async (ctx, next) => {
  const { token } = ctx.request.headers
  const result = await checkTK(token)
  const { method, url } = ctx.request

  if (result.user === guest && (authMethods.includes(method) || JSON.parse(ctx.query.isPrivate) === 1)) {
    ctx.throw(GUEST_NOT_ALLOWED)
  }

  if (result.code === TOKEN_INVALID.code) {
    ctx.state.tokenValid = false

    if ((authMethods.includes(method)
      || (authAPIs.find(api => url.startsWith(api)) && method !== 'OPTIONS'))
      && url !== '/admin/login') {
      ctx.throw(403)
    }
  } else {
    ctx.state.token = result.token
    ctx.state.tokenValid = true
  }
  await next()
}

module.exports = tku
