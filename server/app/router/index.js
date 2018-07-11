const Router = require('koa-router')

const router = new Router()

router.use('', require('./home').routes())
router.use('/admin', require('./admin').routes())

module.exports = router
