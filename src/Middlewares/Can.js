'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require('../Exceptions/ForbiddenException')
const _ = require('lodash')

class Can {
  * check (user, args) {
    try {
      let operator = 'and'
      if (_.includes(['or', 'and'], args[0])) {
        operator = args[0]
        args = _.drop(args)
      }
      const can = yield user.can(args, operator)
      if (!can) {
        throw new ForbiddenException()
      }
    } catch (e) {
      throw e
    }
  }

  * handle (request, response, next, ...args) {
    yield this.check(request.authUser, args)

    yield next
  }

  * handleWs (socket, request, next, ...args) {
    yield this.check(socket.authUser, args)

    yield next
  }
}

module.exports = Can
