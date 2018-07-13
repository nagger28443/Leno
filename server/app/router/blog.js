const Router = require('koa-router')
const codes = require('../../constants/codes')

const u = require('../../utils/u')
const MDParser = require('../../utils/MDParser')
const path = require('path')

const router = new Router()

// 获取博客列表, 返回id!!!!!!
router.get('/list', async ctx => {
  const { search, category, labels, archive, page, pageSize = 10, hasDetail = false } = ctx.query
  const listSql = `SELECT id,title,DATE_FORMAT(date,'%Y-%m-%d') as date,category,labels,visit_cnt
  as visitCount FROM blogs`
  const countSql = `SELECT COUNT(id) as totalCount FROM blogs`
  let where
  let totalCount
  if (page) {
    where = `limit ${(page - 1) * pageSize},${page * pageSize}`
  }

  // 搜索博客
  if (search) {
    where = `WHERE title LIKE '%${search}%' || category LIKE '%${search}%' || labels LIKE '%${search}%'
     ORDER BY date DESC, visit_cnt DESC ${where}`

    await u.dbQuery(`${countSql} ${where}`).then(result => {
      ;[{ totalCount }] = result
    })
    if (totalCount === 0) {
      ctx.body = u.response(codes.EMPTY_RESULT)
    } else {
      await u.dbQuery(`${listSql} ${where}`).then(result => {
        ctx.body = u.response(codes.SUCCESS, { result, totalCount })
      })
    }
    return
  }

  // 获取某类目下博客列表
  if (category) {
    where = `WHERE category=? ORDER BY date DESC, visit_cnt DESC ${where}`

    await u.dbQuery(`${countSql} ${where}`, [category]).then(result => {
      ;[{ totalCount }] = result
    })
    if (totalCount === 0) {
      ctx.body = u.response(codes.EMPTY_RESULT)
    } else {
      await u.dbQuery(`${listSql} ${where}`, [category]).then(result => {
        ctx.body = u.response(codes.SUCCESS, { result, totalCount })
      })
    }
    return
  }

  console.log(123)
  // 获取具有某标签的博客列表

  // 按归档日期获取博客列表

  // 获取首页列表,待文章内容

  // const { title, date } = ctx.query
  // const query = {
  //   sql: `SELECT title,content,date,category,labels FROM blogs where title=? AND date=?`,
  //   values: [title, date],
  // }

  // await u.dbQuery(query).then(res => {
  //   if (res.length > 0) {
  //     ctx.body = u.response(codes.SUCCESS, {
  //       ...res[0],
  //       date: res[0].date.toLocaleDateString(),
  //     })
  //   } else {
  //     ctx.throw(404)
  //   }
  // })

  // ctx.body = {
  //   code: 20000,
  //   data: 123,
  // }
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
    .dbQuery('INSERT INTO blogs SET ?', {
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

  const sql1 = `SELECT title,content,date,category,labels,visit_cnt as visitCount FROM blogs where title=? AND date=?`
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
  const sql2 = `UPDATE blogs SET visit_cnt=visit_cnt+1 WHERE title=? AND date=?`
  u.dbQuery(sql2, [title, date])

  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)
})

module.exports = router
