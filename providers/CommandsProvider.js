'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ServiceProvider = require('adonis-fold').ServiceProvider

class CommandsProvider extends ServiceProvider {
  * register () {
    this.app.bind('Adonis/Commands/Acl:Setup', function () {
      const Setup = require('../commands/Setup')
      return new Setup()
    })
    this.app.bind('Adonis/Commands/Acl:Role', function () {
      const Role = require('../commands/Role')
      return new Role()
    })
    this.app.bind('Adonis/Commands/Acl:Permission', function () {
      const Permission = require('../commands/Permission')
      return new Permission()
    })
  }
}

module.exports = CommandsProvider
