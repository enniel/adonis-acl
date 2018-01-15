'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const CanFactory = require('./Can')
const IsFactory = require('./Is')
const ScopeFactory = require('./Scope')

module.exports = function (View) {
  const Can = CanFactory(View.engine.BaseTag)
  View.tag(new Can())
  const Is = IsFactory(View.engine.BaseTag)
  View.tag(new Is())
  const Scope = ScopeFactory(View.engine.BaseTag)
  View.tag(new Scope())
}
