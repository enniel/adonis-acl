'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const NE = require('node-exceptions')

class ForbiddenException extends NE.HttpException {
  static get defaultMessage () {
    return 'Access forbidden. You are not allowed to this resource.'
  }

  constructor (message) {
    super(message || ForbiddenException.defaultMessage, 403)
  }
}

module.exports = ForbiddenException
