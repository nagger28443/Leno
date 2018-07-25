const codes = require('../constants/codes')
const u = require('../utils/u')

const draftService = {}

// 获取草稿列表
draftService.getDraftList = async (ctx) => {
  const { page, pageSize = 20 } = ctx.query

  const listSql = 'SELECT id,title, DATE_FORMAT(gmt_modify,\'%Y-%m-%d %H:%i\') as date,category,labels FROM draft'
  const countSql = 'SELECT COUNT(id) as total FROM draft'
  const orderSql = 'ORDER BY gmt_modify DESC'
  const pageSql = page ? `limit ${(page - 1) * pageSize},${pageSize}` : ''
  const commonCond = `${orderSql} ${pageSql}`
  const whereSql = 'WHERE deleted=0'

  const [{ total }] = await u.dbQuery(`${countSql} ${whereSql}`)
  console.log(total)
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
  const sql = 'SELECT title,content,DATE_FORMAT(gmt_modify,\'%Y-%m-%d %H:%i\') as date,category,labels,'
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
    title, category, labels = '', content, isPrivate = false,
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
  const res = await u.dbQuery('INSERT INTO draft SET ?', {
    title,
    content,
    category,
    labels,
    private: isPrivate,
    gmt_create: gmt,
    gmt_modify: gmt,
  })

  ctx.body = u.response(ctx, codes.SUCCESS, { id: res.insertId })
}

// 修改草稿
draftService.updateDraft = async (ctx) => {
  const {
    id, title, category, labels = '', content, isPrivate = false,
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
}

module.exports = draftService
