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

  const prevCategory = (await u.dbQuery('SELECT name as prevName FROM category WHERE id=?', [id]))[0]
  const targetCategory = (await u.dbQuery('SELECT id count FROM category WHERE name=?', [name]))
  const { prevName } = prevCategory
  // if target category name exist
  if (targetCategory.length > 0) {
    if (prevName !== name) {
      // delete prev category
      u.dbQuery('DELETE FROM category WHERE id=?', [id])
      // update blogs
      await u.dbQuery('UPDATE blog SET category=? WHERE category=?', [name, prevName])
      // update category
      u.dbQuery('UPDATE  category SET count=(SELECT count(id) FROM blog WHERE category=?)', [name])
    }
  } else {
    // update blog
    u.dbQuery('UPDATE blog SET category=? WHERE category=?', [name, prevName])
    // update category
    u.dbQuery('UPDATE category SET name=? WHERE id=?', [name, id])
  }
  ctx.body = u.response(ctx, codes.SUCCESS)
  u.updateStatistics({ categoryCnt: true })
}

module.exports = categoryService
