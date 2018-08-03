const fs = require('fs')
const mysql = require('mysql')
const redis = require('redis')
const crypto = require('crypto')
const {
  salt, dbTables, user, password, corsOrigins, dbUser, dbPassword,
} = require('../config')
const codes = require('../constants/codes')

let pool = null

const u = {
  redisClient: (() => {
    let client = null
    return () => {
      if (client) return client

      client = redis.createClient()
      // promisify
      client.getAsync = key => new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
      return client
    }
  })()(),
  init: async () => {
    // finally polyfill
    Promise.prototype.finally = function(callback) { //eslint-disable-line
      const P = this.constructor
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
          throw reason
        }),
      )
    }

    try {
      pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: dbUser,
        password: dbPassword,
        port: '3306',
        database: 'leno',
      })
    } catch (e) {
      console.log('数据库连接失败.......')
    }

    // 判断数据库是否正常的简易方法
    try {
      const existTables = await u.dbQuery('SHOW TABLES')

      await dbTables.forEach(async (table) => {
        if (existTables.find(t => t.Tables_in_leno === table.name)) return
        await u.dbQuery(table.createSql)

        if (table.name === 'user') {
          u.dbQuery('INSERT INTO user set ?', { name: user, password: u.passwordEncrypt(password) })
        }
      })
    } catch (e) {
      u.log(e)
    }

    // 初始化stattistics
    u.updateStatistics({
      categoryCnt: true, labelCnt: true, blogCnt: true, draftCnt: true, recycleCnt: true,
    })
  },
  // query from databse with promise
  dbQuery: (query, data) => new Promise((resolve, reject) => {
    pool.query(query, data, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  }),

  // 更新统计数据
  updateStatistics: async ({
    categoryCnt, labelCnt, blogCnt, draftCnt, recycleCnt,
  }) => {
    if (categoryCnt) {
      const t = (await u.dbQuery('SELECT count(id) AS count FROM category'))[0].count
      u.redisClient.set('categoryCnt', t)
    }
    if (labelCnt) {
      const t = (await u.dbQuery('SELECT count(id) AS count FROM label'))[0].count
      u.redisClient.set('labelCnt', t)
    }
    if (blogCnt) {
      const publicCnt = (await u.dbQuery('SELECT count(id) AS count FROM blog WHERE deleted=0 AND private=0'))[0].count
      const privateCnt = (await u.dbQuery('SELECT count(id) AS count FROM blog WHERE deleted=0 && private=1'))[0].count
      u.redisClient.set('publicCnt', publicCnt)
      u.redisClient.set('privateCnt', privateCnt)
    }
    if (draftCnt) {
      const t = (await u.dbQuery('SELECT count(id) AS count FROM draft WHERE deleted=0'))[0].count
      u.redisClient.set('draftCnt', t)
    }
    if (recycleCnt) {
      const t = (await u.dbQuery('SELECT count(id) AS count FROM blog WHERE deleted=1'))[0].count
        + (await u.dbQuery('SELECT count(id) AS count FROM draft WHERE deleted=1'))[0].count
      u.redisClient.set('recycleCnt', t)
    }
  },
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
  response: (ctx, code, data = {}) => {
    const resp = { ...code, data }
    const { token } = ctx.state
    if (token && code === codes.SUCCESS) {
      resp.token = token
    }
    ctx.body = resp
    return resp
  },
  dbParamsGenerator: (ctx, checkArr) => {
    const params = {}
    checkArr.forEach((key) => {
      if (!u.isEmpty(ctx.query[key])) {
        params[key] = ctx.qeury[key]
      }
    })
    return params
  },

  isEmpty: (param) => {
    if (typeof param === 'string' || Array.isArray(param)) return param.length === 0
    return !param
  },

  passwordEncrypt: (pwd) => {
    const hash = crypto.createHash('md5')
    hash.update(`${hash}${pwd}`)
    hash.update(`${hash}${salt}`)
    return hash.digest('hex')
  },

  getLoginFailedCount: async () => {
    const count = await u.redisClient.getAsync('loginFailedCount')
    return count || 0
  },
  setLoginFailedCount: async (count) => {
    u.redisClient.set('loginFailedCount', count)
  },

  corsHandler: async (ctx, next) => {
    const { origin } = ctx.request.header
    if (corsOrigins.includes(origin)) {
      ctx.set('Access-Control-Allow-Origin', origin)
      ctx.set('Access-Control-Allow-Credentials', true)
      ctx.set('Access-Control-Allow-Headers', 'Content-Type')
      ctx.set('Access-Control-Max-Age', 3600)
    } else {
      u.response(ctx, codes.SUCCESS)
      return
    }
    await next()
  },

  // 全局错误处理
  errHandler: async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (err.code === codes.GUEST_NOT_ALLOWED.code) {
        u.response(ctx, codes.GUEST_NOT_ALLOWED)
      } else if (err.status) {
        ctx.response.status = err.status
      } else {
        u.log(err)
      }
    }
  },
  logger: async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    u.log(`${ctx.method} ${decodeURIComponent(ctx.url)} - ${ms}ms`)
  },
  log: (text) => {
    console.log(text)
  },
}

module.exports = u
