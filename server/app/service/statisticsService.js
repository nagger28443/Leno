const u = require('../utils/u')
const codes = require('../constants/codes')

const statisticsService = {}

statisticsService.getHomeStatistics = async (ctx) => {
  const { redisClient } = ctx.state
  const categoryCnt = await redisClient.getAsync('categoryCnt')
  const labelCnt = await redisClient.getAsync('labelCnt')
  const blogCnt = await redisClient.getAsync('blogCnt')
  ctx.body = u.response(ctx, codes.SUCCESS, { category: categoryCnt, label: labelCnt, blog: blogCnt })
}

module.exports = statisticsService
