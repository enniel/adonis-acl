'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Ace = require('adonis-ace')
const Ioc = require('adonis-fold').Ioc
const path = require('path')
const Command = Ioc.use('Adonis/Src/Command')

class SetupCommand extends Command {
  get signature () {
    return 'acl:setup'
  }

  get description () {
    return 'Setup migration for ACL'
  }

  * handle () {
    yield Ace.call('make:migration', ['create_roles_table'], {
      template: path.join(__dirname, './templates/roles_schema.mustache')
    })
    yield Ace.call('make:migration', ['create_permissions_table'], {
      template: path.join(__dirname, './templates/permissions_schema.mustache')
    })
    yield Ace.call('make:migration', ['create_role_user_table'], {
      template: path.join(__dirname, './templates/role_user_schema.mustache')
    })
    yield Ace.call('make:migration', ['create_permission_role_table'], {
      template: path.join(__dirname, './templates/permission_role_schema.mustache')
    })
    yield Ace.call('make:migration', ['create_permission_user_table'], {
      template: path.join(__dirname, './templates/permission_user_schema.mustache')
    })
  }
}

module.exports = SetupCommand
