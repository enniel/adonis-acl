'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')

class Is {
  async handle ({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }
    
    const is = Acl.check(expression, operand => _.includes(auth.user.preFetchedRoles, operand))
    
    if (!is) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Is
