const Router = require('koa-router')
const u = require('../../utils/u')
const codes = require('../../constants/codes')

const router = new Router()

router.get('/list', async (ctx) => {
  const [{ total }] = await u.dbQuery('SELECT COUNT(id) as total FROM category')
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const { page, pageSize = 10 } = ctx.query
    const sql = `SELECT id,name,count FROM category ORDER BY count DESC ${
      page ? `LIMIT ${(page - 1) * pageSize},${pageSize}` : ''
    }`
    const result = await u.dbQuery(sql)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
})

module.exports = router
