'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')

const validateScope = (required, provided) => {
  return _.every(required, (scope) => {
    return _.some(provided, (permission) => {
      // user:* -> user:create, user:view:self
      const regExp = new RegExp('^' + scope.replace('*', '.*') + '$')
      if (regExp.exec(permission)) {
        return true
      }
      return false
    })
  })
}

module.exports = class HasPermission {
  register (Model) {
    Model.prototype.permissions = function () {
      return this.belongsToMany('Adonis/Acl/Permission')
    }

    Model.prototype.getPermissions = async function () {
      let permissions = await this.permissions().fetch()
      permissions = permissions.rows.map(({ slug }) => slug)
      if (typeof this.roles === 'function') {
        const roles = await this.roles().fetch()
        let rolesPermissions = []
        for (let role of roles.rows) {
          const rolePermissions = await role.getPermissions()
          rolesPermissions = rolesPermissions.concat(rolePermissions)
        }
        permissions = _.uniq(permissions.concat(rolesPermissions))
      }
      return permissions
    }

    Model.prototype.can = async function (expression) {
      const permissions = await this.getPermissions()
      return Acl.check(expression, operand => _.includes(permissions, operand))
    }

    Model.prototype.scope = async function (required) {
      const provided = await this.getPermissions()
      return validateScope(required, provided)
    }
  }
}
