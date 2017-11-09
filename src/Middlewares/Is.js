'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')
const _ = require('lodash')

class Is {
  async check ({ user }, args) {
    try {
      let operator = 'and'
      if (_.includes(['or', 'and'], args[0])) {
        operator = args[0]
        args = _.drop(args)
      }
      const is = await user.is(args, operator)
      if (!is) {
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

module.exports = Is
