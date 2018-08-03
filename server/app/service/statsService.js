const u = require('../utils/u')
const codes = require('../constants/codes')

const statsService = {}

statsService.getHomeStatistics = async (ctx) => {
  const { admin } = ctx.query

  if (admin) {
    if (ctx.state.tokenValid) {
      const publicCnt = await u.redisClient.getAsync('publicCnt')
      const privateCnt = await u.redisClient.getAsync('privateCnt')
      const draftCnt = await u.redisClient.getAsync('draftCnt')
      const recycleCnt = await u.redisClient.getAsync('recycleCnt')
      u.response(ctx, codes.SUCCESS, {
        publicCnt, privateCnt, draftCnt, recycleCnt,
      })
      return
    }
    ctx.throw(403)
  }

  const categoryCnt = await u.redisClient.getAsync('categoryCnt')
  const labelCnt = await u.redisClient.getAsync('labelCnt')
  const blogCnt = await u.redisClient.getAsync('publicCnt')
  u.response(ctx, codes.SUCCESS, { category: categoryCnt, label: labelCnt, blog: blogCnt })
}

module.exports = statsService
