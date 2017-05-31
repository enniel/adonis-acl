'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')
const _ = require('lodash')

class Is {
  * handle (request, response, next, ...args) {
    try {
      let operator = 'and'
      if (_.includes(['or', 'and'], args[0])) {
        operator = args[0]
        args = _.drop(args)
      }
      const currentUser = request.currentUser || request.authUser
      const is = yield currentUser.is(args, operator)
      if (!is) {
        throw new ForbiddenException()
      }
    } catch (e) {
      throw e
    }
    yield next
  }
}

module.exports = Is
