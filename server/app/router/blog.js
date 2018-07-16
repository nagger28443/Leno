const Router = require('koa-router')
const codes = require('../../constants/codes')

const u = require('../../utils/u')
const MDParser = require('../../utils/MDParser')
const path = require('path')

const router = new Router()

const serachBlog = async ({ ctx, search, countSql, listSql, commonCond }) => {
  const whereSql = `WHERE title LIKE '%${search}%' || category LIKE '%${search}%' || labels LIKE '%${search}%'`
  let totalCount

  await u.dbQuery(`${countSql} ${whereSql}`).then(result => {
    ;[{ totalCount }] = result
  })
  if (totalCount === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
  } else {
    await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, totalCount })
    })
  }
}

const getBlogByCategory = async ({ ctx, category, countSql, listSql, commonCond }) => {
  const whereSql = `WHERE category=?`
  let totalCount

  await u.dbQuery(`${countSql} ${whereSql}`, [category]).then(result => {
    ;[{ totalCount }] = result
  })
  if (totalCount === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
  } else {
    await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`, [category]).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, totalCount })
    })
  }
}

const getBlogByLabels = async ({ ctx, labels, countSql, listSql, commonCond }) => {
  let totalCount
  const params = labels.split(',')
  const labelSql = params.map(label => `labels LIKE '%${label}%'`).join(' AND ')
  const whereSql = `WHERE ${labelSql}`
  await u.dbQuery(`${countSql} ${whereSql}`, params).then(result => {
    ;[{ totalCount }] = result
  })
  if (totalCount === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
  } else {
    await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`, params).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, totalCount })
    })
  }
}

const getBlogByArchive = async ({ ctx, archive, countSql, listSql, commonCond }) => {
  let totalCount
  let whereSql = ''
  if (/^\d{4}$/.test(archive)) {
    whereSql = `WHERE DATE_FORMAT(date,'%Y')=?`
  } else if (/^\d{4}-\d{2}$/.test(archive)) {
    whereSql = `WHERE DATE_FORMAT(date,'%Y-%m')=?`
  } else if (archive === 'all') {
    whereSql = ''
  } else if (/^\d{4}-\d+-\d+$/.test(archive)) {
    whereSql = `WHERE DATE_FORMAT(date,'%Y-%m-%d')=?`
  } else {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
    return
  }

  await u.dbQuery(`${countSql} ${whereSql}`, [archive]).then(result => {
    ;[{ totalCount }] = result
  })
  if (totalCount === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
  } else {
    await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`, [archive]).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, totalCount })
    })
  }
}

const getHomeBlogs = async ({ ctx, countSql, commonCond }) => {
  let totalCount
  const listSql = `SELECT id,title,DATE_FORMAT(date,'%Y-%m-%d') as date,category,labels,visit_cnt
  as visitCount,content FROM blog`

  await u.dbQuery(`${countSql}`).then(result => {
    ;[{ totalCount }] = result
  })
  if (totalCount === 0) {
    ctx.body = u.response(codes.SUCCESS, { result: [], totalCount })
  } else {
    await u.dbQuery(`${listSql} ${commonCond}`).then(result => {
      ctx.body = u.response(codes.SUCCESS, { result, totalCount })
    })
  }
}
// 获取博客列表
router.get('/list', async ctx => {
  const { search, category, labels, archive, page, pageSize = 20, hasDetail = false } = ctx.query
  const listSql = `SELECT id,title,DATE_FORMAT(date,'%Y-%m-%d') as date,category,labels,visit_cnt
  as visitCount FROM blog`
  const countSql = `SELECT COUNT(id) as totalCount FROM blog`
  const orderSql = `ORDER BY date DESC, visit_cnt DESC`
  let pageSql = ''
  if (page) {
    pageSql = `limit ${(page - 1) * pageSize},${pageSize}`
  }
  const commonCond = `${orderSql} ${pageSql}`

  // 搜索博客
  if (search) {
    await serachBlog({ ctx, search, countSql, listSql, commonCond })
    return
  }

  // 获取某类目下博客列表
  if (category) {
    await getBlogByCategory({ ctx, category, countSql, listSql, commonCond })
    return
  }
  // 获取具有某标签的博客列表
  if (labels) {
    await getBlogByLabels({ ctx, labels, countSql, listSql, commonCond })
    return
  }

  // 按归档日期获取博客列表
  if (archive) {
    await getBlogByArchive({ ctx, archive, countSql, listSql, commonCond })
    return
  }
  // 获取首页列表,待文章内容
  if (hasDetail) {
    await getHomeBlogs({ ctx, archive, countSql, listSql, commonCond })
  }
})

router.post('/', async ctx => {
  const { title, category, labels } = ctx.query
  const gmt = new Date().toLocaleString()
  const date = new Date().toLocaleDateString()
  // todo
  const contentFile = await u.readFile(path.resolve(__dirname, '../blogs/3.md'))
  const content = MDParser(contentFile)
  // todo
  // 以及更新category,labels,archive表
  await u
    .dbQuery('INSERT INTO blog SET ?', {
      title,
      content,
      category,
      labels,
      date,
      gmt_create: gmt,
      gmt_modify: gmt,
    })
    .then(() => {
      ctx.body = u.response(codes.SUCCESS)
    })
})

router.get('/', async ctx => {
  const { title, date } = ctx.query

  const sql1 = `SELECT title,content,date,category,labels,visit_cnt as visitCount FROM blog where title=? AND date=?`
  await u.dbQuery(sql1, [title, date]).then(res => {
    if (res.length > 0) {
      ctx.body = u.response(codes.SUCCESS, {
        ...res[0],
        date: res[0].date.toLocaleDateString(),
      })
    } else {
      ctx.throw(404)
    }
  })

  // 增加访问次数
  const sql2 = `UPDATE blog SET visit_cnt=visit_cnt+1 WHERE title=? AND date=?`
  u.dbQuery(sql2, [title, date])
})

module.exports = router
