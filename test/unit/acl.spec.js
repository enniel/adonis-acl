'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Acl = require('../../src/Acl')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
require('co-mocha')

describe('Acl', function () {
  context('and()', function () {
    it('should return false', function () {
      expect(Acl.and(['admin', 'moderator'], [])).to.be.false()
      expect(Acl.and(['admin', 'moderator'], ['admin'])).to.be.false()
      expect(Acl.and(['admin', 'moderator'], ['admin', 'customer'])).to.be.false()
      expect(Acl.and(['admin'], ['moderator'])).to.be.false()
    })

    it('should return true', function () {
      expect(Acl.and(['admin', 'moderator'], ['admin', 'moderator'])).to.be.true()
      expect(Acl.and(['admin', 'moderator'], ['admin', 'moderator', 'customer'])).to.be.true()
      expect(Acl.and(['admin'], ['admin', 'moderator'])).to.be.true()
      expect(Acl.and(['moderator'], ['admin', 'moderator'])).to.be.true()
    })
  })

  context('or()', function () {
    it('should return false', function () {
      expect(Acl.or(['admin', 'moderator'], [])).to.be.false()
      expect(Acl.or(['admin', 'moderator'], ['customer'])).to.be.false()
    })

    it('should return true', function () {
      expect(Acl.or(['admin', 'moderator'], ['admin'])).to.be.true()
      expect(Acl.or(['admin', 'moderator'], ['admin', 'moderator', 'customer'])).to.be.true()
      expect(Acl.or(['admin'], ['admin', 'moderator'])).to.be.true()
      expect(Acl.or(['moderator'], ['admin', 'moderator'])).to.be.true()
    })
  })

  context('check()', function () {
    it('should return false', function () {
      expect(Acl.check([], ['admin', 'moderator'])).to.be.false()
      expect(Acl.check(['admin'], ['admin', 'moderator'])).to.be.false()
      expect(Acl.check(['admin', 'customer'], ['admin', 'moderator'])).to.be.false()
      expect(Acl.check(['admin'], ['moderator'])).to.be.false()
      expect(Acl.check([], ['admin', 'moderator'], 'and')).to.be.false()
      expect(Acl.check(['admin'], ['admin', 'moderator'], 'and')).to.be.false()
      expect(Acl.check(['admin', 'customer'], ['admin', 'moderator'], 'and')).to.be.false()
      expect(Acl.check(['admin'], ['moderator'], 'and')).to.be.false()
      expect(Acl.check([], ['admin', 'moderator'], 'or')).to.be.false()
      expect(Acl.check(['customer'], ['admin', 'moderator'], 'or')).to.be.false()
    })

    it('should return true', function () {
      expect(Acl.check(['admin', 'moderator'], ['admin', 'moderator'])).to.be.true()
      expect(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator'])).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['admin'])).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['moderator'])).to.be.true()
      expect(Acl.check(['admin', 'moderator'], 'moderator')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['admin', 'moderator'], 'and')).to.be.true()
      expect(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator'], 'and')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['admin'], 'and')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['moderator'], 'and')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], 'moderator', 'and')).to.be.true()
      expect(Acl.check(['admin'], ['admin', 'moderator'], 'or')).to.be.true()
      expect(Acl.check(['admin', 'moderator', 'customer'], ['admin', 'moderator'], 'or')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['admin'], 'or')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], ['moderator'], 'or')).to.be.true()
      expect(Acl.check(['admin', 'moderator'], 'moderator', 'or')).to.be.true()
    })

    it('should throw InvalidOperatorException', function () {
      try {
        Acl.check(['admin', 'moderator'], ['admin', 'moderator'], 'other')
        expect(true).to.equal(false)
      } catch (e) {
        expect(e.name).to.equal('InvalidOperatorException')
        expect(e.message).to.equal('Invalid operator, available operators are "and", "or".')
      }
    })
  })
})
