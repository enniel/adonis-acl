'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')

class Can {
  async handle ({ auth }, next, expression) {
    const can = await auth.user.can(expression)
    if (!can) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Can
