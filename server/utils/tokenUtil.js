const { secret, authAPIs } = require('../config')
const jwt = require('jsonwebtoken')
const { TOKEN_INVALID } = require('../constants/codes')

const tku = {}

tku.tokenGenerator = () => jwt.sign({ expiresIn: 60 * 60 }, secret)

const checkToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, result) => {
      if (err) {
        reject(TOKEN_INVALID)
      }
      if (result.expiresIn / 2 + result.iat > Date.now() / 1000) {
        resolve(tku.tokenGenerator())
      }
      resolve(token)
    })
  })

tku.checkToken = async (ctx, next) => {
  const token = JSON.parse(ctx.query.token || '{}')
  ctx.state.tokenValid = false
  await checkToken(token)
    .then(tk => {
      const { redisClient } = ctx.state
      redisClient.set('token', tk)
      ctx.cookies.set('token', JSON.stringify(tk))
      ctx.state.tokenValid = true
    })
    .catch(err => {
      if (err === TOKEN_INVALID) {
        if (authAPIs.includes(decodeURIComponent(ctx.url))) {
          ctx.throw(403)
        }
      } else {
        throw err
      }
    })

  await next()
}

module.exports = tku
