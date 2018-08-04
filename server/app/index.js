const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const u = require('./utils/u.js')
const tku = require('./utils/tokenUtil')

const app = new Koa()
const router = new Router()

u.init()

router.use('', require('./router').routes())

app.use(u.errHandler)
app.use(u.logger)
app.use(u.headersHandler)
app.use(bodyParser())
app.use(tku.checkToken)

app.use(router.routes())

app.listen(3000, () => {
  console.log('服务启动，监听 http://127.0.0.1:3000/')
})
