const Router = require('koa-router')

const router = new Router()
const util = require('../../utils/util')
const MDParser = require('../../utils/MDParser')
const path = require('path')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  date: Date,
  category: String,
  labels: Array,
  content: String,
})
const Blog = mongoose.model('Blog', blogSchema)

router.get('/blogList', async ctx => {
  const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  const contentHtml = MDParser(contentFile)
  console.log(contentHtml)
  console.log(123)

  mongoose.connect('mongodb://localhost/leno')
  const db = mongoose.connection
  db.on('error', () => {
    console.log('db error')
  })
  db.once('open', () => {
    const query = Blog.find()
    query.then(doc => {
      console.log(doc)
    })
    // const blog = new Blog({
    //   title: 'React中实现离开页面确认提示',
    //   date: Date.now(),
    //   category: 'coding',
    //   labels: ['React', 'React-Router'],
    //   content: contentHtml,
    // })
    // blog.save(err => {
    //   if (err) {
    //     console.log(err)
    //   }
    // })
  })

  ctx.body = '222'
})

router.post('/blog', async ctx => {
  mongoose.connect('mongodb://localhost/leno')
  const db = mongoose.connection
  db.on('error', () => {
    console.log('db error')
  })
  db.once('open', () => {
    console.log('open')
  })

  // const contentFile = await util.readFile(path.resolve(__dirname, '../blogs/3.md'))
  // const contentHtml = MDParser(contentFile)

  ctx.body = '222'
})

module.exports = router
