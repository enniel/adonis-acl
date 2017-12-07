'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')

class Scope {
  async handle ({ auth }, next, ...expression) {
    const scope = await auth.user.scope(...expression)
    if (!scope) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Scope
