const fs = require('fs')
const mysql = require('mysql')
const redis = require('redis')
const { salt } = require('../config')
const crypto = require('crypto')

// const codes = require('../constants/codes')

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'nagger',
  password: '123456',
  port: '3306',
  database: 'leno',
})
const redisClient = redis.createClient()

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
    redisClient.getAsync = key =>
      new Promise((resolve, reject) => {
        redisClient.get(key, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    ctx.state.redisClient = redisClient
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

  passwordEncrypt: pwd => {
    const hash = crypto.createHash('md5')
    hash.update(`${hash}${pwd}`)
    hash.update(`${hash}${salt}`)
    return hash.digest('hex')
  },

  getLoginFailedCount: async () => {
    const count = await redisClient.getAsync('loginFailedCount')
    return count || 0
  },
  setLoginFailedCount: async count => {
    redisClient.set('loginFailedCount', count)
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

redisClient.getAsync = key =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
const ff = async () => {
  redisClient.set('token', JSON.stringify({ aaa: 10 }))
  redisClient
    .getAsync('token')
    .then(res => {
      console.log(res)
    })
    .catch(() => {
      console.log(123)
    })
}
ff()

module.exports = u
