'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')
const _ = require('lodash')

class Can {
  async check ({ user }, args) {
    try {
      let operator = 'and'
      if (_.includes(['or', 'and'], args[0])) {
        operator = args[0]
        args = _.drop(args)
      }
      const can = await user.can(args, operator)
      if (!can) {
        throw new ForbiddenException()
      }
    } catch (e) {
      throw e
    }
  }

  async handle ({ auth }, next, ...args) {
    await this.check(auth, args)

    await next()
  }
}

module.exports = Can
