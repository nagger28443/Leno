const fs = require('fs')
const mysql = require('mysql')
// const codes = require('../constants/codes')

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'nagger',
  password: '123456',
  port: '3306',
  database: 'leno',
})

const u = {
  init: async (ctx, next) => {
    // finally polyfill
    Promise.prototype.finally = function(callback) { //eslint-disable-line
      const P = this.constructor
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason =>
          P.resolve(callback()).then(() => {
            throw reason
          }),
      )
    }
    ctx.state.pool = pool
    await next()
  },
  // query from databse with promise
  dbQuery: (query, data) =>
    new Promise((resolve, reject) => {
      pool.query(query, data, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    }),
  // .finally(() => {
  //   connection.end()
  // }),
  /**
   * 将 fs.readFile 包装成 Promise ，方便在 async/await 中使用
   */
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, content) => {
        if (err) {
          reject(err)
        }
        resolve(content)
      })
    })
  },

  // 请求返回格式化
  response: (code, data = {}) => ({
    ...code,
    data,
  }),

  dbParamsGenerator: (ctx, checkArr) => {
    const params = {}
    checkArr.forEach(key => {
      if (!u.isEmpty(ctx.query[key])) {
        params[key] = ctx.qeury[key]
      }
    })
    return params
  },

  isEmpty: param => {
    if (typeof param === 'string' || Array.isArray(param)) return param.length === 0
    return !param
  },

  // 全局错误处理
  errHandler: async (ctx, next) => {
    try {
      ctx.set('Access-Control-Allow-Origin', '*')
      await next()
    } catch (err) {
      // handle
      // if (ctx.response.status === 404) {
      //   ctx.body = '无记录'
      // }
      console.log(err)
    }
  },
  logger: async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    u.log(`${ctx.method} ${decodeURIComponent(ctx.url)} - ${ms}ms`)
  },

  /**
   * 简易的日志方法
   */
  log: msg => {
    console.log(msg)
  },
}

module.exports = u
