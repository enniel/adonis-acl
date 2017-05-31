'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ServiceProvider = require('adonis-fold').ServiceProvider

class AclProvider extends ServiceProvider {
  * register () {
    this.app.bind('Adonis/Acl/Role', function () {
      return require('../src/Models/Role')
    })
    this.app.bind('Adonis/Acl/Permission', function () {
      return require('../src/Models/Permission')
    })
    this.app.bind('Adonis/Acl/HasRole', function () {
      return require('../src/Traits/HasRole')
    })
    this.app.bind('Adonis/Acl/HasPermission', function () {
      return require('../src/Traits/HasPermission')
    })
    this.app.bind('Adonis/Acl/Is', function () {
      const Is = require('../src/Middlewares/Is')
      return new Is()
    })
    this.app.bind('Adonis/Acl/Can', function () {
      const Can = require('../src/Middlewares/Can')
      return new Can()
    })
  }
}

module.exports = AclProvider
