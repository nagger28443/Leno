const Router = require('koa-router')
const u = require('../../utils/u')
const codes = require('../../constants/codes')

const router = new Router()

router.get('/', async ctx => {
  const sql = `SELECT name,count FROM statistics`
  await u.dbQuery(sql).then(result => {
    const res = {}
    result.forEach(item => {
      res[item.name] = item.count
    })
    ctx.body = u.response(codes.SUCCESS, res)
  })
})

module.exports = router
