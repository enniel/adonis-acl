'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const test = require('japa')
const _ = require('lodash')
const Acl = require('../../src/Acl')

test.group('Acl', function () {
  test('without operators', async (assert) => {
    assert.isTrue(await Acl.check('admin', (operand) => {
      return _.includes(['admin'], operand)
    }))
    assert.isTrue(await Acl.check('(admin)', (operand) => {
      return _.includes(['admin'], operand)
    }))
  })

  test('and operator', async (assert) => {
    assert.isTrue(await Acl.check('admin && moderator', (operand) => {
      return _.includes(['admin', 'moderator'], operand)
    }))
    assert.isFalse(await Acl.check('admin && moderator', (operand) => {
      return _.includes([], operand)
    }))
    assert.isTrue(await Acl.check('admin and moderator', (operand) => {
      return _.includes(['admin', 'moderator'], operand)
    }))
    assert.isFalse(await Acl.check('admin and moderator', (operand) => {
      return _.includes([], operand)
    }))
  })

  test('not operator', async (assert) => {
    assert.isTrue(await Acl.check('!moderator', (operand) => {
      return _.includes(['admin'], operand)
    }))
    assert.isFalse(await Acl.check('!moderator', (operand) => {
      return _.includes(['moderator'], operand)
    }))
    assert.isTrue(await Acl.check('not moderator', (operand) => {
      return _.includes(['admin'], operand)
    }))
    assert.isFalse(await Acl.check('not moderator', (operand) => {
      return _.includes(['moderator'], operand)
    }))
  })

  test('or operator', async (assert) => {
    assert.isTrue(await Acl.check('admin || moderator', (operand) => {
      return _.includes(['admin', 'moderator'], operand)
    }))
    assert.isTrue(await Acl.check('admin || moderator', (operand) => {
      return _.includes(['admin'], operand)
    }))
    assert.isFalse(await Acl.check('admin || moderator', (operand) => {
      return _.includes([], operand)
    }))
    assert.isFalse(await Acl.check('admin || moderator', (operand) => {
      return _.includes(['customer'], operand)
    }))
    assert.isTrue(await Acl.check('admin or moderator', (operand) => {
      return _.includes(['admin', 'moderator'], operand)
    }))
    assert.isTrue(await Acl.check('admin or moderator', (operand) => {
      return _.includes(['admin'], operand)
    }))
    assert.isFalse(await Acl.check('admin or moderator', (operand) => {
      return _.includes([], operand)
    }))
    assert.isFalse(await Acl.check('admin or moderator', (operand) => {
      return _.includes(['customer'], operand)
    }))
  })

  test('complex expression', async (assert) => {
    assert.isTrue(await Acl.check('(admin && moderator) && !customer', (operand) => {
      return _.includes(['admin', 'moderator'], operand)
    }))
    assert.isFalse(await Acl.check('(admin && moderator) && !customer', (operand) => {
      return _.includes(['admin', 'moderator', 'customer'], operand)
    }))
  })

  test('should throw InvalidExpression', async (assert) => {
    try {
      await Acl.check('admin &&& moderator')
    } catch (e) {
      assert.equal(e.name, 'InvalidExpression')
      assert.equal(e.message, 'Invalid expression.')
    }
  })
})
