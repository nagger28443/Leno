const u = require('../utils/u')
const codes = require('../constants/codes')

const statsService = {}

statsService.getHomeStatistics = async (ctx) => {
  const { admin } = ctx.query
  const { redisClient } = ctx.state

  if (admin) {
    if (ctx.state.tokenValid) {
      const publicCnt = await redisClient.getAsync('publicCnt')
      const privateCnt = await redisClient.getAsync('privateCnt')
      const draftCnt = await redisClient.getAsync('draftCnt')
      const recycleCnt = await redisClient.getAsync('recycleCnt')
      ctx.body = u.response(ctx, codes.SUCCESS, {
        publicCnt, privateCnt, draftCnt, recycleCnt,
      })
      return
    }
    ctx.throw(403)
  }

  const categoryCnt = await redisClient.getAsync('categoryCnt')
  const labelCnt = await redisClient.getAsync('labelCnt')
  const blogCnt = await redisClient.getAsync('publicCnt')
  ctx.body = u.response(ctx, codes.SUCCESS, { category: categoryCnt, label: labelCnt, blog: blogCnt })
}

module.exports = statsService
