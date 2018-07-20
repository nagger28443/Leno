const Router = require('koa-router')
const u = require('../../utils/u')
const codes = require('../../constants/codes')

const router = new Router()

router.get('/', async (ctx) => {
  const sql = 'SELECT name,count FROM statistics'
  const res = await u.dbQuery(sql)
  const result = {}
  res.forEach((item) => {
    result[item.name] = item.count
  })
  ctx.body = u.response(codes.SUCCESS, result)
})

module.exports = router
