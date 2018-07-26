const codes = require('../constants/codes')
const u = require('../utils/u')
const MDParser = require('../utils/MDParser')

const service = {}

// todo 参数校验
const getWhereSql = ({
  search, category, labels, archive, deleted, isPrivate,
}) => {
  const conditions = [`deleted=${deleted}`]

  if (archive) {
    if (/^\d{4}$/.test(archive) || /^\d{4}-\d{2}$/.test(archive)) {
      conditions.push(`date like '${archive}%'`)
    } else if (archive !== 'all') {
      return false
    }
  }

  if (search) {
    conditions.push(`(title LIKE '%${search}%' OR category LIKE '%${search}%' OR labels LIKE '%${search}%')`)
  }

  if (category) {
    conditions.push(`category='${category}'`)
  }

  if (labels) {
    labels.split(',').forEach((label) => {
      conditions.push(`labels LIKE '%${label}%'`)
    })
  }

  if (isPrivate === 1 || isPrivate === 0) {
    conditions.push(`private=${isPrivate}`)
  }

  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
}

// 获取博客列表
service.getBlogList = async (ctx) => {
  const {
    search,
    category,
    labels,
    archive,
    page,
    pageSize = 20,
    deleted = 0,
    hasDetail = false,
    isPrivate = 0,
  } = ctx.query

  if ((isPrivate || deleted) && !ctx.state.tokenValid) {
    ctx.throw(403)
  }

  const listSql = `SELECT id,title,date,category,labels,visit_cnt as visitCount
   ${hasDetail ? ',content' : ''} FROM blog`
  const countSql = 'SELECT COUNT(id) as total FROM blog'
  const orderSql = 'ORDER BY date DESC, visit_cnt DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`

  const whereSql = getWhereSql({
    search, category, labels, archive, deleted: Number(deleted), isPrivate: Number(isPrivate),
  })

  if (!whereSql) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total: 0 })
  }

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }

  if (hasDetail) {
    u.dbQuery(`UPDATE blog SET visit_cnt=visit_cnt+1 ${whereSql}`)
  }
}

// 获取博客内容
service.getBlog = async (ctx) => {
  const { id, title, date } = ctx.query

  const selectSql = 'SELECT title,content,date,category,labels,visit_cnt AS visitCount,'
    + 'private AS isPrivate,deleted FROM blog'
  let whereSql = ''
  let params = []
  if (id) {
    whereSql = 'WHERE id=?'
    params = [id]
  } else if (title && date) {
    whereSql = 'WHERE title=? AND date=?'
    params = [title, date]
  } else {
    ctx.throw(404)
  }

  const sql1 = `${selectSql} ${whereSql}`
  const res = await u.dbQuery(sql1, params)
  if (res.length > 0) {
    const { isPrivate, deleted } = res[0]
    if ((isPrivate || deleted) && !ctx.state.tokenValid) {
      ctx.throw(403)
    }
    ctx.body = u.response(ctx, codes.SUCCESS, res[0])
  } else {
    ctx.throw(404)
  }

  // 增加访问次数
  const sql2 = `UPDATE blog SET visit_cnt=visit_cnt+1 ${whereSql}`
  u.dbQuery(sql2, params)
}

const updateCategoryLabelArchive = ({ category, labels, date }) => {
  const commonCond = 'private=0 AND deleted=0'
  // 更新category表
  u.dbQuery(`INSERT INTO category set name=?,count=1 ON DUPLICATE KEY UPDATE count=(
    SELECT COUNT(id) FROM blog WHERE category=? AND ${commonCond})`,
  [category, category])

  // 更新archive表
  if (date) {
    u.dbQuery(`INSERT INTO archive set date=?,count=1 ON DUPLICATE KEY UPDATE count=( 
  SELECT COUNT(id) FROM blog WHERE date LIKE '${date.slice(0, 7)}%' AND ${commonCond})`, [date.slice(0, 7)])
  }

  // 更新label表
  if (labels) {
    labels
      .split(',')
      .forEach(async (label) => {
        u.dbQuery(`INSERT INTO label set name=?,count=1 ON DUPLICATE KEY UPDATE count=(
              SELECT COUNT(id) FROM blog WHERE labels LIKE '%${label}%' AND ${commonCond})`, [label])
      })
  }
}

// 发表文章
service.addBlog = async (ctx) => {
  const {
    title, category, labels = '', content, isPrivate = 0,
  } = ctx.request.body
  if ([title, category, content].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:title,category,content`,
    })
    return
  }
  const contentHTMLStr = MDParser(content)
  const gmt = new Date()

  const year = gmt.getFullYear()
  const month = gmt.getMonth() + 1
  const day = gmt.getDate()
  const date = `${year}-${month <= 9 ? 0 : ''}${month}-${day <= 9 ? 0 : ''}${day}`

  // 插入博客信息
  await u.dbQuery('INSERT INTO blog SET ?', {
    title,
    content: contentHTMLStr,
    category,
    labels,
    date,
    private: isPrivate,
    gmt_create: gmt,
    gmt_modify: gmt,
  })
  ctx.body = u.response(ctx, codes.SUCCESS)

  updateCategoryLabelArchive({ category, labels: labels.length > 0 ? labels : null, date })
  // 更新statistics
  u.updateStatistics({ categoryCnt: true, labelCnt: true, blogCnt: true })
}


// 修改文章
service.updateBlog = async (ctx) => {
  const {
    id, title, category, labels = '', content, isPrivate = 0,
  } = ctx.request.body
  if ([id, title, category, content].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:id,title,category,content`,
    })
    return
  }

  const sql1 = 'SELECT category,labels FROM blog where id=?'
  const res1 = await u.dbQuery(sql1, [id])
  if (u.isEmpty(res1)) {
    ctx.throw(404)
  }

  const contentHTMLStr = MDParser(content)
  const gmt = new Date()

  const year = gmt.getFullYear()
  const month = gmt.getMonth() + 1
  const day = gmt.getDate()
  const date = `${year}-${month <= 9 ? 0 : ''}${month}-${day <= 9 ? 0 : ''}${day}`

  // 更新博客信息
  await u.dbQuery(`UPDATE blog SET ? WHERE id=${id}`, {
    title,
    content: contentHTMLStr,
    category,
    labels,
    date,
    private: isPrivate,
    gmt_create: gmt,
    gmt_modify: gmt,
  })
  ctx.body = u.response(ctx, codes.SUCCESS)

  updateCategoryLabelArchive({ category, labels: labels.length > 0 ? labels : null, date })

  // 更新statistics
  u.updateStatistics({ categoryCnt: true, labelCnt: true, blogCnt: true })
}


service.deleteBlog = async (ctx) => {
  const { id } = ctx.query

  const res = await u.dbQuery('SELECT category,labels,date FROM blog WHERE id=?', [id])
  if (res.length === 0) {
    ctx.throw(404)
  }

  await u.dbQuery('UPDATE BLOG SET deleted=1 WHERE id=?', [id])
  ctx.body = u.response(ctx, codes.SUCCESS)

  const blog = res[0]
  const { category, labels, date } = blog
  updateCategoryLabelArchive({ category, labels: labels.length > 0 ? labels : null, date })

  // 更新statistics
  u.updateStatistics({
    categoryCnt: true, labelCnt: true, blogCnt: true, recycleCnt: true,
  })
}

module.exports = service
