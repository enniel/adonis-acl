'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Ioc = require('adonis-fold').Ioc
const Model = Ioc.use('Adonis/Src/Lucid')
const _ = require('lodash')

class Role extends Model {
  static get rules () {
    return {
      slug: 'required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$',
      name: 'required|min:3|max:255',
      description: 'min:3|max:1000'
    }
  }

  permissions () {
    return this.belongsToMany('Adonis/Acl/Permission')
  }

  * getPermissions () {
    let permissions = (yield this.permissions().fetch()).toJSON()
    return _.map(permissions, ({ slug }) => {
      return slug
    })
  }
}

module.exports = Role
