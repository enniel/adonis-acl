'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const test = require('japa')
const Acl = require('../../src/Acl')

test.group('Acl.and', function () {
  test('should return false', function (assert) {
    assert.isFalse(Acl.and(['admin', 'moderator'], []))
    assert.isFalse(Acl.and(['admin', 'moderator'], ['admin']))
    assert.isFalse(Acl.and(['admin', 'moderator'], ['admin', 'customer']))
    assert.isFalse(Acl.and(['admin'], ['moderator']))
  })

  test('should return true', function (assert) {
    assert.isTrue(Acl.and(['admin', 'moderator'], ['admin', 'moderator']))
    assert.isTrue(Acl.and(['admin', 'moderator'], ['admin', 'moderator', 'customer']))
    assert.isTrue(Acl.and(['admin'], ['admin', 'moderator']))
    assert.isTrue(Acl.and(['moderator'], ['admin', 'moderator']))
  })
})

test.group('Acl.or', function () {
  test('should return false', function (assert) {
    assert.isFalse(Acl.or(['admin', 'moderator'], []))
    assert.isFalse(Acl.or(['admin', 'moderator'], ['customer']))
  })

  test('should return true', function (assert) {
    assert.isTrue(Acl.or(['admin', 'moderator'], ['admin']))
    assert.isTrue(Acl.or(['admin', 'moderator'], ['admin', 'moderator', 'customer']))
    assert.isTrue(Acl.or(['admin'], ['admin', 'moderator']))
    assert.isTrue(Acl.or(['moderator'], ['admin', 'moderator']))
  })
})

test.group('Acl.check', function () {
  test('should return false', function (assert) {
    assert.isFalse(Acl.check([], ['admin', 'moderator']))
    assert.isFalse(Acl.check(['admin'], ['admin', 'moderator']))
    assert.isFalse(Acl.check(['admin', 'customer'], ['admin', 'moderator']))
    assert.isFalse(Acl.check(['admin'], ['moderator']))
    assert.isFalse(Acl.check([], ['admin', 'moderator'], 'and'))
    assert.isFalse(Acl.check(['admin'], ['admin', 'moderator'], 'and'))
    assert.isFalse(Acl.check(['admin', 'customer'], ['admin', 'moderator'], 'and'))
    assert.isFalse(Acl.check(['admin'], ['moderator'], 'and'))
    assert.isFalse(Acl.check([], ['admin', 'moderator'], 'or'))
    assert.isFalse(Acl.check(['customer'], ['admin', 'moderator'], 'or'))
  })

  test('should return true', function (assert) {
    assert.isTrue(Acl.check(['admin', 'moderator'], ['admin', 'moderator']))
    assert.isTrue(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator']))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['admin']))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['moderator']))
    assert.isTrue(Acl.check(['admin', 'moderator'], 'moderator'))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['admin', 'moderator'], 'and'))
    assert.isTrue(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator'], 'and'))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['admin'], 'and'))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['moderator'], 'and'))
    assert.isTrue(Acl.check(['admin', 'moderator'], 'moderator', 'and'))
    assert.isTrue(Acl.check(['admin'], ['admin', 'moderator'], 'or'))
    assert.isTrue(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator'], 'or'))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['admin'], 'or'))
    assert.isTrue(Acl.check(['admin', 'moderator'], ['moderator'], 'or'))
    assert.isTrue(Acl.check(['admin', 'moderator'], 'moderator', 'or'))
  })

  test('should throw InvalidOperatorException', function (assert) {
    try {
      Acl.check(['admin', 'moderator'], ['admin', 'moderator'], 'other')
    } catch (e) {
      assert.equal(e.name, 'InvalidOperatorException')
      assert.equal(e.message, 'Invalid operator, available operators are "and", "or".')
    }
  })
})
