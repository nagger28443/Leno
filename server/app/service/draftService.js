const codes = require('../constants/codes')
const u = require('../utils/u')

const draftService = {}

// 获取草稿列表
draftService.getDraftList = async (ctx) => {
  const page = ctx.query.page ? JSON.parse(ctx.query.page) : null
  const pageSize = ctx.query.pageSize ? JSON.parse(ctx.query.pageSize) : 20


  const listSql = 'SELECT id,title, DATE_FORMAT(gmt_modify,\'%Y-%m-%d %H:%i\') as date,category,labels FROM draft'
  const countSql = 'SELECT COUNT(id) as total FROM draft'
  const orderSql = 'ORDER BY gmt_modify DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`
  const whereSql = 'WHERE deleted=0'

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  if (total === 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, { result: [], total })
  } else {
    const result = await u.dbQuery(`${listSql} ${whereSql} ${commonCond}`)
    ctx.body = u.response(ctx, codes.SUCCESS, { result, total })
  }
}

// 获取草稿内容
draftService.getDraft = async (ctx) => {
  const { id } = ctx.query
  const sql = 'SELECT title,md,category,DATE_FORMAT(gmt_modify,\'%Y-%m-%d %H:%i\') as date,md,labels,'
    + 'private as isPrivate FROM draft where id=?'
  const res = await u.dbQuery(sql, [id])
  if (res.length > 0) {
    ctx.body = u.response(ctx, codes.SUCCESS, res[0])
  } else {
    ctx.throw(404)
  }
}

// 新建草稿
draftService.addDraft = async (ctx) => {
  const {
    title, category, labels = '', md,
  } = ctx.request.body

  const isPrivate = ctx.query.isPrivate ? JSON.parse(ctx.query.isPrivate) : 0


  // 是否缺少必需的参数
  if ([title, category, md].some(item => u.isEmpty(item))) {
    const { message } = codes.INSURFICIENT_PARAMS
    ctx.body = u.response(ctx, {
      ...codes.INSURFICIENT_PARAMS,
      message: `${message}:title,category,content`,
    })
    return
  }

  // 插入博客信息
  const gmt = new Date()
  const res = await u.dbQuery('INSERT INTO draft SET ?', {
    title,
    md,
    category,
    labels,
    private: isPrivate,
    gmt_create: gmt,
    gmt_modify: gmt,
  })

  ctx.body = u.response(ctx, codes.SUCCESS, { id: res.insertId })

  u.updateStatistics({ draftCnt: true })
}

// 修改草稿
draftService.updateDraft = async (ctx) => {
  const {
    id, title, category, labels = '', md,
  } = ctx.request.body

  const isPrivate = ctx.query.isPrivate ? JSON.parse(ctx.query.isPrivate) : 0

  // 是否缺少必需的参数
  if ([id, title, category, md].some(item => u.isEmpty(item))) {
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
    md,
    category,
    labels,
    private: isPrivate,
    gmt_modify: gmt,
  })

  ctx.body = u.response(ctx, codes.SUCCESS)
}

draftService.deleteDraft = async (ctx) => {
  const { id } = ctx.query
  if (!id) {
    const { message } = codes.INSURFICIENT_PARAMS
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

  u.updateStatistics({ draftCnt: true })
}

module.exports = draftService
