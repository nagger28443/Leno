const { salt, authAPIs } = require('../config')
const jwt = require('jsonwebtoken')
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../constants/codes')

const tku = {}

tku.generator = () => jwt.sign({ expiresIn: 60 * 60 }, salt)

const checkToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, salt, (err, result) => {
      if (err) {
        reject(TOKEN_INVALID)
      }
      if (result.expiresIn + result.iat > Date.now() / 1000) {
        reject(TOKEN_EXPIRED)
      }
      if (result.expiresIn / 2 + result.iat > Date.now() / 1000) {
        resolve(tku.generator())
      }
      resolve(token)
    })
  })

tku.checkToken = async (ctx, next) => {
  const { token } = ctx.query
  ctx.state.tokenValid = false
  console.log(ctx.request.url)
  await checkToken(token)
    .then(tk => {
      ctx.cookies.set('token', JSON.stringify(tk))
      ctx.state.tokenValid = true
    })
    .catch(err => {
      if (authAPIs.includes(decodeURIComponent(ctx.url))) {
        if (err === TOKEN_INVALID) {
          ctx.throw(403)
        }
        if (err === TOKEN_EXPIRED) {
          ctx.throw(TOKEN_EXPIRED)
        }
      }
      if (err !== TOKEN_INVALID && err !== TOKEN_EXPIRED) {
        throw err
      }
    })

  await next()
}
module.exports = tku
