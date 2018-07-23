const Router = require('koa-router')

const router = new Router()

router.options('/*', async (ctx) => {
  const { headers } = ctx.request
  ctx.set('Access-Control-Allow-Methods', headers['access-control-request-method'])
  ctx.set('Access-Control-Allow-Origin', headers.origin)
  ctx.set('Access-Control-Allow-Headers', '*')
  ctx.status = 204
})

router.use('/blog', require('./blog').routes())
router.use('/draft', require('./draft').routes())
router.use('/category', require('./category').routes())
router.use('/archive', require('./archive').routes())
router.use('/label', require('./label').routes())
router.use('/statistics', require('./statistics').routes())

router.use('/admin', require('./admin').routes())

module.exports = router
