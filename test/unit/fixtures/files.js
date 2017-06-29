'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const fs = require('co-fs-extra')
const path = require('path')

module.exports = {
  createDir: function * () {
    return yield fs.ensureDir(path.join(__dirname, '../storage'))
  }
}
