const codes = require('../constants/codes')
const u = require('../utils/u')

const recycleService = {}


// 获取草稿列表
recycleService.getRecycleList = async (ctx) => {
  const page = ctx.query.page ? JSON.parse(ctx.query.page) : 1
  const pageSize = ctx.query.pageSize ? JSON.parse(ctx.query.pageSize) : 20

  const listSql = 'SELECT id,title,DATE_FORMAT(gmt_modify,\'%Y-%m-%d %H:%i\') as date,category,labels FROM'
  const blogCountSql = 'SELECT COUNT(id) as cnt FROM blog'
  const draftCountSql = 'SELECT COUNT(id) as cnt FROM draft'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const whereSql = `WHERE deleted=1 ${pageSql}`

  const blogTotal = (await u.dbQuery(`${blogCountSql} ${whereSql}`))[0].cnt
  const draftTotal = (await u.dbQuery(`${draftCountSql} ${whereSql}`))[0].cnt
  const total = blogTotal + draftTotal

  if (total === 0) {
    u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const drafts = await u.dbQuery(`${listSql} draft ${whereSql}`)
    const blogs = await u.dbQuery(`${listSql} blog ${whereSql}`)
    const result = [
      ...drafts.map(item => ({ ...item, type: 'draft' })),
      ...blogs.map(item => ({ ...item, type: 'blog' })),
    ]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice((page - 1) * pageSize, page * pageSize)
    u.response(ctx, codes.SUCCESS, { result, total })
  }
}

recycleService.deleteItem = async (ctx) => {
  const { id, type } = ctx.query
  await u.dbQuery(`UPDATE ${type} SET deleted=-1 WHERE id=?`, [id])
  u.response(ctx, codes.SUCCESS)
  u.updateStatistics({ recycleCnt: true })
}

module.exports = recycleService
