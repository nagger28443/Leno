const u = require('../utils/u')
const codes = require('../constants/codes')

const labelService = {}


labelService.getLabelList = async (ctx) => {
  const [{ total }] = await u.dbQuery('SELECT COUNT(id) as total FROM label')
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const { page, pageSize = 20 } = ctx.query
    const sql = `SELECT id,name,count FROM label ORDER BY count DESC ${
      page ? `LIMIT ${(page - 1) * pageSize},${pageSize}` : ''
    }`
    const result = await u.dbQuery(sql)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
}

module.exports = labelService
