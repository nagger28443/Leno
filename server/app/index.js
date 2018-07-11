const Koa = require('koa')
const Router = require('koa-router')
const u = require('../utils/u')

u.init()

const app = new Koa()
const router = new Router()

router.use('', require('./router').routes())

app.use(u.errHandler)
app.use(router.routes())

app.listen(3000, () => {
  console.log('服务启动，监听 http://127.0.0.1:3000/')
})
