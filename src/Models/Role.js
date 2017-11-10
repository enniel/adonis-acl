'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Model = use('Adonis/Src/Model')

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

  async getPermissions () {
    const permissions = await this.permissions().fetch()
    return permissions.rows.map(({ slug }) => slug)
  }
}

module.exports = Role
