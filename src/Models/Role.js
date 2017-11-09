'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Model = use('Adonis/Src/Model')
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

  getPermissions () {
    return this.permissions().fetch().then(permissions => {
      return _.map(permissions.toJSON(), ({ slug }) => slug)
    })
  }
}

module.exports = Role
