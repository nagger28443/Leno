const jwt = require('jsonwebtoken')
const { secret, authAPIs } = require('../config')
const { TOKEN_INVALID } = require('../constants/codes')

const tku = {}

tku.tokenGenerator = () => jwt.sign({ expiresIn: 60 * 60 }, secret)

const checkTK = token => new Promise((resolve) => {
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      resolve(TOKEN_INVALID)
    }
    if (result.expiresIn / 2 + result.iat > Date.now() / 1000) {
      resolve(tku.tokenGenerator())
    }
    resolve(token)
  })
})

tku.checkToken = async (ctx, next) => {
  const { token } = ctx.request.headers
  const result = await checkTK(token)
  if (result.code === TOKEN_INVALID.code) {
    ctx.state.tokenValid = false
    if (authAPIs.includes(decodeURIComponent(ctx.url))) {
      ctx.throw(403)
    }
  } else {
    ctx.state.token = result
    ctx.state.tokenValid = true
  }
  // ctx.cookies.set('token', JSON.stringify(tk))
  await next()
}

module.exports = tku
