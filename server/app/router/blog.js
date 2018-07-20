const Router = require('koa-router')
const codes = require('../../constants/codes')

const u = require('../../utils/u')
const MDParser = require('../../utils/MDParser')

const router = new Router()

// todo 参数校验

const getPrivateBlogs = async ({
  ctx, countSql, listSql, commonCond,
}) => {
  const whereSql = 'WHERE private=1 AND deleted=0'
  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}

const serachBlog = async ({
  ctx, search, countSql, listSql, commonCond, hasPrivate,
}) => {
  const whereSql = `WHERE (title LIKE '%${search}%' OR category LIKE '%${search}%' OR labels LIKE '%${search}%') ${
    !hasPrivate ? 'AND private=0' : ''
  } AND deleted=0`

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}

const getBlogByCategory = async ({
  ctx, category, countSql, listSql, commonCond, hasPrivate,
}) => {
  const whereSql = `WHERE category=?  ${!hasPrivate ? 'AND private=0' : ''} AND deleted=0`
  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`, [category])
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`, [category])
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}

const getBlogByLabels = async ({
  ctx, labels, countSql, listSql, commonCond, hasPrivate,
}) => {
  const params = labels.split(',')
  const labelSql = params.map(label => `labels LIKE '%${label}%'`).join(' AND ')
  const whereSql = `WHERE ${labelSql} ${!hasPrivate ? 'AND private=0' : ''} AND deleted=0`
  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`, params)
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`, params)
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}

const getBlogByArchive = async ({
  ctx, archive, countSql, listSql, commonCond, hasPrivate,
}) => {
  let whereSql = ''
  if (/^\d{4}$/.test(archive) || /^\d{4}-\d{2}$/.test(archive)) {
    whereSql = `WHERE date like '${archive}%' ${!hasPrivate ? 'AND private=0' : ''} AND deleted=0`
  } else if (archive === 'all') {
    whereSql = `WHERE deleted=0 ${!hasPrivate ? 'AND private=0' : ''}`
  } else {
    ctx.body = u.response(codes.SUCCESS, { result: [], total: 0 })
    return
  }

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}

const getHomeBlogs = async ({ ctx, countSql, commonCond }) => {
  const listSql = `SELECT id,title,date,category,labels,visit_cnt
  as visitCount,content,private as isPrivate FROM blog`
  const [{ total }] = await u.dbQuery(`${countSql}`)
  if (total === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${commonCond}`)
    ctx.body = u.response(codes.SUCCESS, { result, total })
  }
}
// 获取博客列表
router.get('/list', async (ctx) => {
  const {
    search,
    category,
    labels,
    archive,
    page,
    pageSize = 20,
    hasDetail = false,
    isPrivate = false,
  } = ctx.query

  if (isPrivate && !ctx.state.tokenValid) {
    ctx.throw(403)
  }

  const listSql = 'SELECT id,title,date,category,labels,visit_cnt as visitCount FROM blog'
  const countSql = 'SELECT COUNT(id) as total FROM blog'
  const orderSql = 'ORDER BY date DESC, visit_cnt DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`
  const hasPrivate = ctx.state.tokenValid

  if (isPrivate) {
    await getPrivateBlogs({
      ctx, countSql, listSql, commonCond,
    })
    return
  }

  // 搜索博客
  if (search) {
    await serachBlog({
      ctx, search, countSql, listSql, commonCond, hasPrivate,
    })
    return
  }

  // 获取某类目下博客列表
  if (category) {
    await getBlogByCategory({
      ctx, category, countSql, listSql, commonCond, hasPrivate,
    })
    return
  }
  // 获取具有某标签的博客列表
  if (labels) {
    await getBlogByLabels({
      ctx, labels, countSql, listSql, commonCond, hasPrivate,
    })
    return
  }

  // 按归档日期获取博客列表
  if (archive) {
    await getBlogByArchive({
      ctx, archive, countSql, listSql, commonCond, hasPrivate,
    })
    return
  }
  // 获取首页列表,待文章内容
  if (hasDetail) {
    await getHomeBlogs({
      ctx, archive, countSql, listSql, commonCond,
    })
  }
})

router.get('/', async (ctx) => {
  const { title, date } = ctx.query

  const sql1 = 'SELECT title,content,date,category,labels,visit_cnt as visitCount FROM blog where title=? AND date=?'
  const res = await u.dbQuery(sql1, [title, date])
  if (res.length > 0) {
    ctx.body = u.response(codes.SUCCESS, {
      ...res[0],
      date: res[0].date,
    })
  } else {
    ctx.throw(404)
  }

  // 增加访问次数
  const sql2 = 'UPDATE blog SET visit_cnt=visit_cnt+1 WHERE title=? AND date=?'
  u.dbQuery(sql2, [title, date])
})

// 发表文章
router.post('/', async (ctx) => {
  const {
    title, category, labels = '', content, isPrivate = 0,
  } = ctx.request.body
  if ([title, category, content].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response({
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:title,category,content`,
    })
    return
  }
  const contentHTMLStr = MDParser(content)
  const gmt = new Date().toLocaleString()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const date = `${year}-${month <= 9 ? 0 : ''}${month}-${day <= 9 ? 0 : ''}${day}`

  // 以及更新category,labels,archive表
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
  ctx.body = u.response(codes.SUCCESS)

  // 更新category表
  await u.dbQuery('INSERT INTO category set name=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [
    category,
  ])

  // 更新archive表
  await u.dbQuery('INSERT INTO archive set date=?,count=1 ON DUPLICATE KEY UPDATE count=count+1', [date.slice(0, 7)])

  // 更新label表
  await labels.split(',')
    .forEach((label) => {
      u.dbQuery(`INSERT INTO label set name='${label}',count=1 ON DUPLICATE KEY UPDATE count=count+1`)
    })

  // 更新statistics
  u.dbQuery('update statistics set count=(select count(*) from category) where name=\'category\'')
  u.dbQuery('update statistics set count=(select count(*) from label) where name=\'label\'')
  u.dbQuery('update statistics set count=(select count(*) from blog) where name=\'blog\'')
})

module.exports = router
