'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Ioc = require('adonis-fold').Ioc
const Model = Ioc.use('Adonis/Src/Lucid')

class Permission extends Model {
  static get rules () {
    return {
      slug: 'required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$',
      name: 'required|min:3|max:255',
      description: 'min:3|max:1000'
    }
  }
}

module.exports = Permission
