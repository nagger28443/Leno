const fs = require('fs')
const mysql = require('mysql')
const codes = require('../constants/codes')

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3306',
  database: 'leno',
})

const u = {
  // finally polyfill
  init: () => {
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
  },
  // insert into databse with promise
  dbInsert: (table, data) =>
    new Promise((resolve, reject) => {
      const query = `INSERT INTO ${table} SET ?`
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
  // query from databse with promise
  dbQuery: query =>
    new Promise((resolve, reject) => {
      pool.query(query, (err, res) => {
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
      console.log(123, err)
    }
  },

  /**
   * 简易的日志方法
   */
  log: msg => {
    console.log(msg)
  },
}

module.exports = u
