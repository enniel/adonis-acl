'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const test = require('japa')
const ace = require('@adonisjs/ace')
const fs = require('fs-extra')
const path = require('path')
const walkSync = require('walk-sync')
const { ioc, registrar } = require('@adonisjs/fold')
const { Config, setupResolver, Helpers } = require('@adonisjs/sink')
const fixtures = require('../fixtures')

test.group('Commands', (group) => {
  group.before(async () => {
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('database', require('../config'))
      return config
    })
    ioc.bind('Adonis/Src/Helpers', () => {
      return new Helpers(path.join(__dirname, '..'))
    })
    ioc.alias('Adonis/Src/Helpers', 'Helpers')

    await registrar
      .providers([
        '@adonisjs/lucid/providers/LucidProvider',
        path.join(__dirname, '../../providers/AclProvider'),
        path.join(__dirname, '../../providers/CommandsProvider')
      ]).registerAndBoot()
    await fs.ensureDir(path.join(__dirname, '../tmp'))
    const Database = use('Database')
    await fixtures.up(Database)
    setupResolver()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  group.after(async function () {
    const Database = use('Database')
    await fixtures.down(Database)
    Database.close()

    try {
      await fs.remove(path.join(__dirname, '../tmp'))
    } catch (error) {
      if (process.platform !== 'win32' || error.code !== 'EBUSY') {
        throw error
      }
    }
  }).timeout(0)

  group.afterEach(async () => {
    const Database = use('Database')
    await fixtures.truncate(Database, 'users')
    await fixtures.truncate(Database, 'permissions')
    await fixtures.truncate(Database, 'permission_user')
    await fixtures.truncate(Database, 'roles')
    await fixtures.truncate(Database, 'permission_role')
  })

  test('acl:role', async (assert) => {
    await ace.call('acl:role', {
      slug: 'administrator',
      name: 'Administrator',
      description: 'Administrator Role Description'
    }, {
      permissions: 'create_users,edit_users,delete_users'
    })
    const Role = use('Adonis/Acl/Role')
    const role = await Role.findBy('name', 'Administrator')
    const permissions = await role.getPermissions()
    assert.equal(role.slug, 'administrator')
    assert.equal(role.name, 'Administrator')
    assert.equal(role.description, 'Administrator Role Description')
    assert.includeMembers(permissions, [
      'create_users', 'edit_users', 'delete_users'
    ])
  })

  test('acl:permission', async (assert) => {
    await ace.call('acl:permission', {
      slug: 'create_users',
      name: 'Create Users',
      description: 'Create Users Permission Description'
    })
    const Permission = use('Adonis/Acl/Permission')
    const permission = await Permission.findBy('slug', 'create_users')
    assert.equal(permission.slug, 'create_users')
    assert.equal(permission.name, 'Create Users')
    assert.equal(permission.description, 'Create Users Permission Description')
  })

  test('acl:setup', async (assert) => {
    await ace.call('acl:setup')
    let paths = walkSync(ioc.use('Helpers').migrationsPath(), { directories: false })
    paths = paths.map(path => path.substring(14))
    assert.includeMembers(paths, [
      'create_permissions_table.js',
      'create_roles_table.js',
      'create_permission_role_table.js',
      'create_permission_user_table.js',
      'create_role_user_table.js'
    ])
  })
})
