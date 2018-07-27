module.exports = {
  SUCCESS: { code: 1, message: 'success' },
  TOKEN_EXPIRED: { code: 2001, message: 'token expired' },
  TOKEN_INVALID: { code: 2002, message: 'token invalid' },
  GUEST_NOT_ALLOWED: { code: 2005, message: 'Sorry, this operation is not authorized for guest account' },

  ILLEGAL_PARAMS: { code: 1004, message: 'illegal params' },
  PASSWORD_OR_USER_INVALID: { code: 2101, message: 'password or user invalid' },
  ACCOUNR_BEING_FROZEN: { code: 2110, message: 'acount being frozen' },

  INSURFICIENT_PARAMS: { code: 3001, message: 'insuficient params' },
  DUPLICATE_ENTRY: { code: 3005, message: 'duplicate entry' },
}
