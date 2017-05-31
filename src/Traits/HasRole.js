'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')

module.exports = {
  register (Model) {
    Model.prototype.roles = function () {
      return this.belongsToMany('Adonis/Acl/Role')
    }

    Model.prototype.getRoles = function * () {
      const roles = (yield this.roles().fetch()).toJSON()
      return _.map(roles, ({ slug }) => {
        return slug
      })
    }

    Model.prototype.is = function * (slug, operator = 'and') {
      const roles = yield this.getRoles()

      return Acl.check(roles, slug, operator)
    }
  }
}
