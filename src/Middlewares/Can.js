'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')

class Can {
  async handle ({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }
    const can = await auth.user.can(expression)
    if (!can) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Can
