const u = require('../utils/u')
const codes = require('../constants/codes')

const categoryService = {}

categoryService.getCategoryList = async (ctx) => {
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
}

categoryService.updateCategory = async (ctx) => {
  const { id, name } = ctx.request.body
  const sql = 'UPDATE category SET ? WHERE id=?'
  await u.dbQuery(sql, [{ name }, id])
  ctx.body = u.response(ctx, codes.SUCCESS)
}

module.exports = categoryService
