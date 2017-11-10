'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const NE = require('node-exceptions')

class InvalidExpression extends NE.InvalidArgumentException {
  static get defaultMessage () {
    return 'Invalid expression.'
  }

  constructor (message) {
    super(message || InvalidExpression.defaultMessage)
  }
}

module.exports = InvalidExpression
