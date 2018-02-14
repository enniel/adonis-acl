'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

require('@adonisjs/lucid/lib/iocResolver').setFold(require('@adonisjs/fold'))
const test = require('japa')
const fs = require('fs-extra')
const path = require('path')
const Model = require('@adonisjs/lucid/src/Lucid/Model')
const DatabaseManager = require('@adonisjs/lucid/src/Database/Manager')
const BelongsToMany = require('@adonisjs/lucid/src/Lucid/Relations/BelongsToMany')
const { ioc } = require('@adonisjs/fold')
const { Config, setupResolver } = require('@adonisjs/sink')
const HasPermission = require('../../src/Traits/HasPermission')
const HasRole = require('../../src/Traits/HasRole')
const fixtures = require('../fixtures')

test.group('Traits', function (group) {
  group.before(async function () {
    ioc.singleton('Adonis/Src/Database', function () {
      const config = new Config()
      config.set('database', require('../config'))
      return new DatabaseManager(config)
    })
    ioc.alias('Adonis/Src/Database', 'Database')
    ioc.bind('Adonis/Src/Model', () => Model)
    ioc.alias('Adonis/Src/Model', 'Model')
    ioc.bind('Adonis/Acl/Role', function () {
      return require('../../src/Models/Role')
    })
    ioc.bind('Adonis/Acl/HasRole', function () {
      return new HasRole()
    })
    ioc.bind('Adonis/Acl/Permission', function () {
      return require('../../src/Models/Permission')
    })
    ioc.bind('Adonis/Acl/HasPermission', function () {
      return new HasPermission()
    })
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

  group.afterEach(async function () {
    const Database = use('Database')
    await fixtures.truncate(Database, 'users')
    await fixtures.truncate(Database, 'permissions')
    await fixtures.truncate(Database, 'permission_user')
    await fixtures.truncate(Database, 'roles')
    await fixtures.truncate(Database, 'permission_role')
  })

  test('should be able to assign HasPermission trait class to the model', function (assert) {
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasPermission'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = new User()
    assert.isTrue(typeof user.permissions === 'function')
    assert.isTrue(user.permissions() instanceof BelongsToMany)
    assert.isTrue(typeof user.getPermissions === 'function')
    assert.isTrue(typeof user.can === 'function')
  })

  test('should be able to assign HasRole trait class to the model', function (assert) {
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasRole'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = new User()
    assert.isTrue(typeof user.roles === 'function')
    assert.isTrue(user.roles() instanceof BelongsToMany)
    assert.isTrue(typeof user.getRoles === 'function')
    assert.isTrue(typeof user.is === 'function')
  })

  test('should be able to get permissions', async function (assert) {
    assert.plan(1)

    const Permission = use('Adonis/Acl/Permission')
    const Role = use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasRole',
          '@provider:Adonis/Acl/HasPermission'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = await User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const createUsers = await Permission.create({
      name: 'Create Users',
      slug: 'create_users'
    })
    const readUsers = await Permission.create({
      name: 'Read Users',
      slug: 'read_users'
    })
    const removeUsers = await Permission.create({
      name: 'Remove Users',
      slug: 'remove_users'
    })
    const administrator = await Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    await administrator.permissions().attach([
      removeUsers.id, createUsers.id
    ])
    await user.roles().attach([
      administrator.id
    ])
    await user.permissions().attach([
      readUsers.id
    ])
    const userPermissions = await user.getPermissions()
    assert.includeMembers(userPermissions, [
      'read_users', 'remove_users', 'create_users'
    ])
  })

  test('should be able to check permissions', async function (assert) {
    assert.plan(1)

    const Permission = use('Adonis/Acl/Permission')
    const Role = use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasRole',
          '@provider:Adonis/Acl/HasPermission'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = await User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const createUsers = await Permission.create({
      name: 'Create Users',
      slug: 'create_users'
    })
    const readUsers = await Permission.create({
      name: 'Read Users',
      slug: 'read_users'
    })
    const removeUsers = await Permission.create({
      name: 'Remove Users',
      slug: 'remove_users'
    })
    const administrator = await Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    await administrator.permissions().attach([
      removeUsers.id, createUsers.id
    ])
    await user.roles().attach([
      administrator.id
    ])
    await user.permissions().attach([
      readUsers.id
    ])
    const can = await user.can('read_users && remove_users && create_users')
    assert.isTrue(can)
  })

  test('should be able to check scope', async function (assert) {
    assert.plan(4)

    const Permission = use('Adonis/Acl/Permission')
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasPermission'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = await User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const createUsers = await Permission.create({
      name: 'Create Users',
      slug: 'user.create'
    })
    const readUsers = await Permission.create({
      name: 'Read Users',
      slug: 'user.read'
    })
    const removeUsers = await Permission.create({
      name: 'Remove Users',
      slug: 'user.remove'
    })
    await user.permissions().attach([
      readUsers.id, createUsers.id, removeUsers.id
    ])
    assert.isTrue(await user.scope(['user.*']))
    assert.isTrue(await user.scope(['user.*', 'user.remove']))
    assert.isFalse(await user.scope(['user.any']))
    assert.isFalse(await user.scope(['user.*', 'user.any']))
  })

  test('should be able to get roles', async function (assert) {
    const Role = use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasRole'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = await User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const administrator = await Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    const moderator = await Role.create({
      name: 'Moderator',
      slug: 'moderator'
    })
    await user.roles().attach([
      administrator.id, moderator.id
    ])
    const userRoles = await user.getRoles()
    assert.includeMembers(userRoles, [
      'administrator', 'moderator'
    ])
  })

  test('should be able to check role', async function (assert) {
    const Role = use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          '@provider:Adonis/Acl/HasRole'
        ]
      }
    }
    User._bootIfNotBooted()
    const user = await User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const administrator = await Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    const moderator = await Role.create({
      name: 'Moderator',
      slug: 'moderator'
    })
    await user.roles().attach([
      administrator.id, moderator.id
    ])
    const is = await user.is('administrator && moderator')
    assert.isTrue(is)
  })
})
