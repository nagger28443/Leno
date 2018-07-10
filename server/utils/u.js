const fs = require('fs')
const mysql = require('mysql')
const codes = require('../constants/codes')

const connection = mysql.createConnection({
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
      connection.connect()
      const sql = `INSERT INTO ${table} (${Object.keys(data).join(',')}) VALUES (${Object.values(
        data,
      )
        .map(item => `'${item}'`)
        .join(',')})`
      connection.query(sql, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    }).finally(() => {
      connection.end()
    }),
  // query from databse with promise
  dbQuery: (table, params, sql) =>
    new Promise((resolve, reject) => {
      connection.connect()
      const query =
        sql ||
        `SELECT * FROM ${table} WHERE ${Object.keys(params)
          .map(key => `${key}=${params[key]}`)
          .join(' AND ')}`
      // SELECT * FROM blogs WHERE title='title' AND date_format(gmt_create,'%Y-%m-%d')='2018-07-10'
      console.log(query)
      connection.query(query, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    }).finally(() => {
      connection.end()
    }),
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

  /**
   * 简易的日志方法
   */
  log: msg => {
    console.log(msg)
  },
}

module.exports = u
