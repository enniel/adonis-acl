'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */
const _ = require("lodash")
const Acl = require("../Acl")
const ForbiddenException = require('../Exceptions/ForbiddenException')

class Can {
  async handle ({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }
    
    const can = Acl.check(expression, operand => _.includes(auth.user.preFetchedPermissions, operand))
    
    if (!can) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Can
