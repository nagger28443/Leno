const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const path = require('path')
const util = require('./util')

// bodyParser 插件，处理 post 提交过来的数据
app.use(bodyParser())

app.use(async ctx => {
  const url = ctx.url

  util.log(`访问地址：${url}；请求方法：${ctx.method}`)

  if (url === '/') { // 首页
    ctx.body = await util.readFile(path.resolve(__dirname, '../public/index.html'))
  } else if (url.indexOf('/get?') === 0) { // get 请求
    ctx.body = util.parse(ctx.query, 'get')
  } else if (url === '/post') { // post 请求
    ctx.body = util.parse(ctx.request.body, 'post')
  } else { // 其他路径都 404
    ctx.body = await util.readFile(path.resolve(__dirname, '../public/404.html'))
  }
})

app.listen(3000, () => {
  util.log('服务启动，打开 http://127.0.0.1:3000/')
})