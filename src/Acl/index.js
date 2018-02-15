'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const { check } = require('acler')

const Acl = exports = module.exports = {}

Acl.check = check

Acl.validateScope = (required, provided) => {
  return _.every(required, (scope) => {
    return _.some(provided, (permission) => {
      // user.* -> user.create, user.view.self
      const regExp = new RegExp('^' + scope.replace('*', '.*') + '$')
      if (regExp.exec(permission)) {
        return true
      }
      return false
    })
  })
}
