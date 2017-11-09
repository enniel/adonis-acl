'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')

module.exports = class HasPermission {
  register (Model) {
    Model.prototype.permissions = function () {
      return this.belongsToMany('Adonis/Acl/Permission')
    }

    Model.prototype.getPermissions = async function () {
      let permissions = (await this.permissions().fetch()).toJSON()
      permissions = _.map(permissions, ({ slug }) => slug)
      if (typeof this.roles === 'function') {
        const roles = await this.roles().fetch()
        let rolePermissions = []
        for (let role of roles.rows) {
          const chain = await role.getPermissions()
          rolePermissions = _.concat(rolePermissions, chain)
        }
        permissions = _.uniq(_.concat(permissions, rolePermissions))
      }
      return permissions
    }

    Model.prototype.can = function (slug, operator = 'and') {
      return this.getPermissions().then(permissions => {
        return Acl.check(permissions, slug, operator)
      })
    }
  }
}
