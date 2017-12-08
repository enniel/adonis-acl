'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')

class Scope {
  async handle ({ auth }, next, ...requiredScope) {
    const isAllowed = await auth.user.scope(requiredScope)
    if (!isAllowed) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Scope
