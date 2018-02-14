'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const path = require('path')
const { ioc, registrar } = require('@adonisjs/fold')
const test = require('japa')

test.group('Providers', (group) => {
  test('AclProvider', async (assert) => {
    await registrar
      .providers([path.join(__dirname, '../../providers/AclProvider')])
      .registerAndBoot()

    assert.isDefined(ioc.use('Adonis/Acl/Role'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Role'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/Permission'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Permission'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/HasRole'))
    assert.isFalse(ioc._bindings['Adonis/Acl/HasRole'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/HasPermission'))
    assert.isFalse(ioc._bindings['Adonis/Acl/HasPermission'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/Init'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Init'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/Scope'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Scope'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/Is'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Is'].singleton)

    assert.isDefined(ioc.use('Adonis/Acl/Can'))
    assert.isFalse(ioc._bindings['Adonis/Acl/Can'].singleton)
  })

  test('CommandsProvider', async (assert) => {
    await registrar
      .providers([path.join(__dirname, '../../providers/CommandsProvider')])
      .registerAndBoot()

    assert.isDefined(ioc.use('Adonis/Commands/Acl:Setup'))
    assert.isFalse(ioc._bindings['Adonis/Commands/Acl:Setup'].singleton)

    assert.isDefined(ioc.use('Adonis/Commands/Acl:Role'))
    assert.isFalse(ioc._bindings['Adonis/Commands/Acl:Role'].singleton)

    assert.isDefined(ioc.use('Adonis/Commands/Acl:Permission'))
    assert.isFalse(ioc._bindings['Adonis/Commands/Acl:Permission'].singleton)
  })
})
