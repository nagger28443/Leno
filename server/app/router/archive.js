const Router = require('koa-router')
const u = require('../../utils/u')
const codes = require('../../constants/codes')

const router = new Router()

router.get('/list', async ctx => {
  let total
  await u.dbQuery('SELECT COUNT(id) as total FROM archive').then(result => {
    ;[{ total }] = result
  })
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const { page = 1, pageSize = 10 } = ctx.query
    const sql = `SELECT id,date,count FROM archive ORDER BY count DESC ${
      page ? `LIMIT ${(page - 1) * pageSize},${pageSize}` : ``
    }`
    await u.dbQuery(sql).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, total })
    })
  }
})

module.exports = router
