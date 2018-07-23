const Router = require('koa-router')
const codes = require('../constants/codes')
const u = require('../utils/u')

const router = new Router()

// 获取草稿列表
router.get('/list', async (ctx) => {
  const { page, pageSize = 20 } = ctx.query

  const listSql = 'SELECT id,title,gmt_modify as time,category,labels FROM draft'
  const countSql = 'SELECT COUNT(id) as total FROM blog'
  const orderSql = 'ORDER BY gmt_modify DESC, visit_cnt DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`
  const whereSql = 'WHRERE deleted=0'

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
})

// 获取草稿内容
router.get('/', async (ctx) => {
  const { id } = ctx.query
  const sql = 'SELECT title,content,gmt_modify as time,category,labels FROM draft where id=?'
  const res = await u.dbQuery(sql, [id])
  if (res.length > 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, res[0])
  } else {
    ctx.throw(404)
  }
})

// 新建草稿
router.post('/', async (ctx) => {
  const {
    title, category, labels = '', content,
  } = ctx.request.body

  // 是否缺少必需的参数
  if ([title, category, content].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:title,category,content`,
    })
    return
  }

  // 插入博客信息
  const gmt = new Date()
  await u.dbQuery('INSERT INTO draft SET ?', {
    title,
    content,
    category,
    labels,
    gmt_create: gmt,
    gmt_modify: gmt,
  })


  ctx.body = u.response(ctx, codes.SUCCESS)
})

// 修改草稿
router.put('/', async (ctx) => {
  const {
    id, title, category, labels = '', content,
  } = ctx.request.body

  // 是否缺少必需的参数
  if ([id, title, category, content].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:id,title,category,content`,
    })
    return
  }

  const gmt = new Date()
  await u.dbQuery(`UPDATE draft SET ? WHERE id=${id}`, {
    title,
    content,
    category,
    labels,
    gmt_modify: gmt,
  })


  ctx.body = u.response(ctx, codes.SUCCESS)
})

router.del('/', async (ctx) => {
  const { id } = ctx.request.body
  if (!id) {
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:id`,
    })
    return
  }

  const gmt = new Date()
  await u.dbQuery(`UPDATE draft SET ? WHERE id=${id}`, {
    deleted: 1,
    gmt_modify: gmt,
  })


  ctx.body = u.response(ctx, codes.SUCCESS)
})

module.exports = router
