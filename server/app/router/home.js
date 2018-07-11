const Router = require('koa-router')
const codes = require('../../constants/codes')

const router = new Router()
const u = require('../../utils/u')
const MDParser = require('../../utils/MDParser')
const path = require('path')

router.get('/blogList', async ctx => {
  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)
  // connection.connect()
  // const sql = 'select * from blog'
  // connection.query(sql, (err, res) => {
  //   if (err) {
  //     console.log(err.message)
  //     return
  //   }
  //   console.log(res)
  // })

  // connection.end()

  throw new Error('11111111111111')

  ctx.body = {
    code: 20000,
    data: 123,
  }
})

router.post('/blog', async ctx => {
  const { title, category, labels } = ctx.query
  const gmt = new Date().toLocaleString()
  const date = new Date().toLocaleDateString()
  // todo
  const contentFile = await u.readFile(path.resolve(__dirname, '../blogs/3.md'))
  const content = MDParser(contentFile)
  // todo
  await u
    .dbInsert('blogs', { title, content, category, labels, date, gmt_create: gmt, gmt_modify: gmt })
    .then(() => {
      ctx.body = u.response(codes.SUCCESS)
    })
})

router.get('/blog', async ctx => {
  const { title, date } = ctx.query
  const query = {
    sql: `SELECT title,content,date,category,labels FROM blogs where title=? AND date=?`,
    values: [title, date],
  }

  await u.dbQuery(query).then(res => {
    if (res.length > 0) {
      ctx.body = u.response(codes.SUCCESS, {
        ...res[0],
        date: res[0].date.toLocaleDateString(),
      })
    } else {
      ctx.throw(404)
    }
  })

  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)
})

module.exports = router
