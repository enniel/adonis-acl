'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')
const _ = require('lodash')

class Can {
  * handle (request, response, next, ...args) {
    try {
      let operator = 'and'
      if (_.includes(['or', 'and'], args[0])) {
        operator = args[0]
        args = _.drop(args)
      }
      const currentUser = request.currentUser || request.authUser
      const can = yield currentUser.can(args, operator)
      if (!can) {
        throw new ForbiddenException()
      }
    } catch (e) {
      throw e
    }
    yield next
  }
}

module.exports = Can
