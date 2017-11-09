'use strict'

const cli = require('japa/cli')
require('@adonisjs/lucid/lib/iocResolver').setFold(require('@adonisjs/fold'))
cli.run('test/**/*.spec.js')
