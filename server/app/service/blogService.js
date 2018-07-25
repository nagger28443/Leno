const codes = require('../constants/codes')
const u = require('../utils/u')
const MDParser = require('../utils/MDParser')

const service = {}

// todo 参数校验
const getWhereSql = ({
  search, category, labels, archive, deleted, isPrivate,
}) => {
  const conditions = []

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

  if (deleted) {
    conditions.push(`deleted=${1}`)
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

  console.log(whereSql)

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
}

// 展开首页文章时增加访问次数 todo
// 获取博客内容
service.getBlog = async (ctx) => {
  const { title, date } = ctx.query

  const sql1 = 'SELECT title,content,date,category,labels,visit_cnt as visitCount FROM blog where title=? AND date=?'
  const res = await u.dbQuery(sql1, [title, date])
  if (res.length > 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, res[0])
  } else {
    ctx.throw(404)
  }

  // 增加访问次数
  const sql2 = 'UPDATE blog SET visit_cnt=visit_cnt+1 WHERE title=? AND date=?'
  u.dbQuery(sql2, [title, date])
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

  // 更新category表
  await u.dbQuery('INSERT INTO category set name=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [
    category,
  ])

  // 更新archive表
  await u.dbQuery('INSERT INTO archive set date=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [date.slice(0, 7)])

  // 更新label表
  labels.split(',')
    .forEach(async (label) => {
      await u.dbQuery(`INSERT INTO label set name='${label}',count=1 ON DUPLICATE KEY UPDATE count=count+1`)
    })

  // 更新statistics
  u.updateStatistics()
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
  const prevCategory = res1[0].category
  const prevLabels = res1[0].labels.split(',')
  console.log(prevLabels)

  const contentHTMLStr = MDParser(content)
  const gmt = new Date()

  const year = gmt.getFullYear()
  const month = gmt.getMonth() + 1
  const day = gmt.getDate()
  const date = `${year}-${month <= 9 ? 0 : ''}${month}-${day <= 9 ? 0 : ''}${day}`

  // 插入博客信息
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

  // 更新category表
  if (prevCategory !== category) {
    await u.dbQuery('UPDATE category set count=count-1 WHERE name=?', [
      prevCategory,
    ])
    await u.dbQuery('INSERT INTO category set name=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [
      category,
    ])
  }

  // 更新archive表
  await u.dbQuery('INSERT INTO archive set date=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [date.slice(0, 7)])

  // 更新label表
  labels.split(',')
    .forEach(async (label) => {
      const index = prevLabels.indexOf(label)
      if (index >= 0) {
        prevLabels.splice(index, 1)
      } else {
        await u.dbQuery(`INSERT INTO label set name='${label}',count=1 ON DUPLICATE KEY UPDATE count=count+1`, [label])
      }
    })
  prevLabels
    .forEach(async (label) => {
      await u.dbQuery('UPDATE label set count=count-1 WHERE name=? AND count>0', [label])
    })

  // 更新statistics
  u.updateStatistics()
}


service.deleteBlog = async (ctx) => {
  console.log(ctx)
}

module.exports = service
