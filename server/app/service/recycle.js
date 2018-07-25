const codes = require('../constants/codes')
const u = require('../utils/u')

const recycleService = {}

// 获取草稿列表
recycleService.getRecycleList = async (ctx) => {
  const { page, pageSize = 20 } = ctx.query

  const listSql = 'SELECT id,title, DATE_FORMAT(gmt_modify,\'%Y-%m-%d %h:%m\') as date,category,labels FROM draft'
  const countSql = 'SELECT COUNT(id) as total FROM blog'
  const orderSql = 'ORDER BY gmt_modify DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`
  const whereSql = 'WHERE deleted=0'

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
}

module.exports = recycleService
