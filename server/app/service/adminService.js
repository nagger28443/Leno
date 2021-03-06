const u = require('../utils/u')
const codes = require('../constants/codes')
const tku = require('../utils/tokenUtil')
const { LOGIN_MAX_FAIL_TIMES, ACCOUNT_FREEZE_TIME } = require('../constants/index')
const { guest } = require('../config')

const adminService = {}

// 登录
adminService.login = async (ctx) => {
  const { name, password } = ctx.request.body

  if (name === guest) {
    const token = tku.tokenGenerator(guest)
    ctx.state.token = token
    // ctx.cookies.set('token', token)
    u.response(ctx, codes.SUCCESS)
    return
  }

  const sql = 'SELECT password AS pwd FROM user WHERE name=?'
  const result = await u.dbQuery(sql, [name])

  // 账户是否冻结
  const freezeTime = (await u.redisClient.getAsync('accountFreezeTime')) || 0
  if (Date.now() / 1000 < freezeTime) {
    u.response(ctx, codes.ACCOUNR_BEING_FROZEN)
    return
  }

  // 登录失败, 更新失败次数, 若超过最大连续失败次数冻结账户并将失败次数清零
  if (result.length === 0 || result[0].pwd !== u.passwordEncrypt(password)) {
    const loginFailedCount = (await u.redisClient.getAsync('loginFailedCount')) || 0
    if (Number(loginFailedCount) + 1 >= LOGIN_MAX_FAIL_TIMES) {
      u.redisClient.set('loginFailedCount', 0)
      u.redisClient.set('accountFreezeTime', Date.now() / 1000 + ACCOUNT_FREEZE_TIME)
      u.response(ctx, codes.ACCOUNR_BEING_FROZEN)
      return
    }

    u.redisClient.set('loginFailedCount', Number(loginFailedCount) + 1)
    u.response(ctx, codes.PASSWORD_OR_USER_INVALID)
    return
  }

  u.redisClient.set('loginFailedCount', 0)
  const token = tku.tokenGenerator()
  ctx.state.token = token
  // ctx.cookies.set('token', token)
  u.response(ctx, codes.SUCCESS)
}


module.exports = adminService
