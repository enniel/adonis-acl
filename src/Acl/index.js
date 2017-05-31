'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Acl = exports = module.exports = {}
const _ = require('lodash')
const NE = require('node-exceptions')

Acl.and = (slug, items) => {
  return _.every(slug, (check) => {
    if (!_.includes(items, check)) {
      return false
    }
    return true
  })
}

Acl.or = (slug, items) => {
  return _.some(slug, (check) => {
    if (_.includes(items, check)) {
      return true
    }
    return false
  })
}

Acl.check = (items, slug, operator = 'and') => {
  if (_.isArray(slug)) {
    if (!_.includes(['or', 'and'], operator)) {
      throw new NE.InvalidArgumentException('Invalid operator, available operators are "and", "or".')
    }
    return Acl[operator](slug, items)
  }

  return _.includes(items, slug)
}
