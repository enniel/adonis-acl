'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const NE = require('node-exceptions')

class InvalidOperatorException extends NE.InvalidArgumentException {
  static get defaultMessage () {
    return 'Invalid operator, available operators are "and", "or".'
  }

  constructor (message) {
    super(message || InvalidOperatorException.defaultMessage)
  }
}

module.exports = InvalidOperatorException
