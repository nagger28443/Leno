const Koa = require('koa')

const app = new Koa()

app.use('', require('./home'))
// app.use('/admin', require('./admin'))
