'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ace = require('@adonisjs/ace')
const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Acl:Setup', () => require('../commands/Setup'))
    this.app.bind('Adonis/Commands/Acl:Role', () => require('../commands/Role'))
    this.app.bind('Adonis/Commands/Acl:Permission', () => require('../commands/Permission'))
  }

  boot () {
    ace.addCommand('Adonis/Commands/Acl:Setup')
    ace.addCommand('Adonis/Commands/Acl:Role')
    ace.addCommand('Adonis/Commands/Acl:Permission')
  }
}

module.exports = CommandsProvider
