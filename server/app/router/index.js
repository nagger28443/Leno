const Router = require('koa-router')

const router = new Router()

router.use('/blog', require('./blog').routes())
router.use('/category', require('./category').routes())
router.use('/archive', require('./archive').routes())
router.use('/label', require('./label').routes())
router.use('/statistics', require('./statistics').routes())

router.use('/admin', require('./admin').routes())

module.exports = router
