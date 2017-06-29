'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Model = require('adonis-lucid/src/Lucid/Model')
const Database = require('adonis-lucid/src/Database')
const BelongsToMany = require('adonis-lucid/src/Lucid/Relations/BelongsToMany')
const HasPermission = require('../../src/Traits/HasPermission')
const HasRole = require('../../src/Traits/HasRole')
const chai = require('chai')
chai.use(require('dirty-chai'))
const Ioc = require('adonis-fold').Ioc
const expect = chai.expect
const assert = chai.assert
const filesFixtures = require('./fixtures/files')
const databaseFixtures = require('./fixtures/database')
const config = require('./helpers/config')
require('co-mocha')

describe('Traits', function () {
  before(function * () {
    Database._setConfigProvider(config)
    Ioc.bind('Adonis/Src/Database', function () {
      return Database
    })
    Ioc.bind('Adonis/Src/Lucid', function () {
      return Model
    })
    Ioc.bind('Adonis/Src/Helpers', function () {
      return {
        makeNameSpace: function (hook) {
          return `App/${hook}`
        }
      }
    })
    Ioc.bind('Adonis/Acl/Role', function () {
      return require('../../src/Models/Role')
    })
    Ioc.bind('Adonis/Acl/HasRole', function () {
      return HasRole
    })
    Ioc.bind('Adonis/Acl/Permission', function () {
      return require('../../src/Models/Permission')
    })
    Ioc.bind('Adonis/Acl/HasPermission', function () {
      return HasPermission
    })
    yield filesFixtures.createDir()
    yield databaseFixtures.up(Database)
  })

  after(function * () {
    yield databaseFixtures.down(Database)
    Database.close()
  })

  it('should be able to assign HasPermission trait class to the model', function () {
    class User extends Model {
      static get traits () {
        return [
          'Adonis/Acl/HasPermission'
        ]
      }
    }
    User.bootIfNotBooted()
    const user = new User()
    expect(user.permissions).to.be.a('function')
    expect(user.permissions() instanceof BelongsToMany).to.be.true()
    expect(typeof user.getPermissions === 'function').to.be.true()
    expect(typeof user.can === 'function').to.be.true()
  })

  it('should be able to assign HasRole trait class to the model', function () {
    class User extends Model {
      static get traits () {
        return [
          'Adonis/Acl/HasRole'
        ]
      }
    }
    User.bootIfNotBooted()
    const user = new User()
    expect(user.roles).to.be.a('function')
    expect(user.roles() instanceof BelongsToMany).to.be.true()
    expect(typeof user.getRoles === 'function').to.be.true()
    expect(typeof user.is === 'function').to.be.true()
  })

  it('should be able to get permissions', function * () {
    const Permission = Ioc.use('Adonis/Acl/Permission')
    const Role = Ioc.use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          'Adonis/Acl/HasRole',
          'Adonis/Acl/HasPermission'
        ]
      }
    }
    User.bootIfNotBooted()
    const user = yield User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const createUsers = yield Permission.create({
      name: 'Create Users',
      slug: 'create_users'
    })
    const readUsers = yield Permission.create({
      name: 'Read Users',
      slug: 'read_users'
    })
    const removeUsers = yield Permission.create({
      name: 'Remove Users',
      slug: 'remove_users'
    })
    const administrator = yield Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    yield administrator.permissions().sync([
      removeUsers.id, createUsers.id
    ])
    yield user.roles().sync([
      administrator.id
    ])
    yield user.permissions().sync([
      readUsers.id
    ])
    const userPermissions = yield user.getPermissions()
    assert.deepEqual(userPermissions, [
      'read_users', 'create_users', 'remove_users'
    ])
    yield databaseFixtures.truncate(Database, 'users')
    yield databaseFixtures.truncate(Database, 'permissions')
    yield databaseFixtures.truncate(Database, 'permission_user')
    yield databaseFixtures.truncate(Database, 'roles')
    yield databaseFixtures.truncate(Database, 'permission_role')
  })

  it('should be able to get roles', function * () {
    const Role = Ioc.use('Adonis/Acl/Role')
    class User extends Model {
      static get traits () {
        return [
          'Adonis/Acl/HasRole'
        ]
      }
    }
    User.bootIfNotBooted()
    const user = yield User.create({
      email: 'foo@bar.baz',
      username: 'test',
      password: 'secret'
    })
    const administrator = yield Role.create({
      name: 'Administrator',
      slug: 'administrator'
    })
    const moderator = yield Role.create({
      name: 'Moderator',
      slug: 'moderator'
    })
    yield user.roles().sync([
      administrator.id, moderator.id
    ])
    const userRoles = yield user.getRoles()
    assert.deepEqual(userRoles, [
      'administrator', 'moderator'
    ])
    yield databaseFixtures.truncate(Database, 'users')
    yield databaseFixtures.truncate(Database, 'roles')
    yield databaseFixtures.truncate(Database, 'role_user')
  })
})
