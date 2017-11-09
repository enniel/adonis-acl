'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')

module.exports = class HasRole {
  register (Model) {
    Model.prototype.roles = function () {
      return this.belongsToMany('Adonis/Acl/Role')
    }

    Model.prototype.getRoles = function () {
      return this.roles().fetch().then(roles => _.map(roles.toJSON(), ({ slug }) => slug))
    }

    Model.prototype.is = function (slug, operator = 'and') {
      return this.getRoles().then(roles => Acl.check(roles, slug, operator))
    }
  }
}
