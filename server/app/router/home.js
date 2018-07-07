const Router = require('koa-router')

const router = new Router()

router.get('/blogList', async ctx => {
  console.log(ctx.request)
  ctx.body = '222'
})

module.exports = router
