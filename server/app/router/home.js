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
  const { title, content, category, labels } = ctx.query
  const gmt = new Date().toLocaleString()

  await u
    .dbInsert('blogs', { title, content, category, labels, gmt_create: gmt, gmt_modify: gmt })
    .then(() => {
      ctx.body = u.response(codes.SUCCESS)
    })
    .catch(err => {
      console.log(err)
    })
  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)
})

router.get('/blog', async ctx => {
  const { title, date } = ctx.query
  console.log(date, date)

  await u
    .dbQuery('blogs', { title, date })
    .then(() => {
      ctx.body = u.response(codes.SUCCESS)
    })
    .catch(err => {
      console.log(err)
    })
  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)
})

module.exports = router
