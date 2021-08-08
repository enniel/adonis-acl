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
      expression = expression.join(' ')
    }
    expression = expression.replace(' or ', ' || ')
    expression = expression.replace(' and ', ' && ')
    expression = expression.replace(' not ', ' !')
    const is = await auth.user.is(expression)
    if (!is) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Is
