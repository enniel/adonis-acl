'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const reduce = require('co-reduce')
const _ = require('lodash')
const Acl = require('../Acl')

module.exports = {
  register (Model) {
    Model.prototype.permissions = function () {
      return this.belongsToMany('Adonis/Acl/Permission')
    }

    Model.prototype.getPermissions = function * () {
      let permissions = (yield this.permissions().fetch()).toJSON()
      permissions = _.map(permissions, ({ slug }) => {
        return slug
      })
      if (typeof this.roles === 'function') {
        const roles = yield this.roles().fetch()
        const roleList = []
        roles.forEach(role => {
          roleList.push(role)
        })
        const rolePermissions = yield reduce(roleList, function * (result, role) {
          const chain = yield role.getPermissions()
          result = _.concat(result, chain)
          return result
        }, [])
        permissions = _.uniq(_.concat(permissions, rolePermissions))
      }
      return permissions
    }

    Model.prototype.can = function * (slug, operator = 'and') {
      const permissions = yield this.getPermissions()

      return Acl.check(permissions, slug, operator)
    }
  }
}
