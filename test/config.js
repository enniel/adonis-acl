'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../.env')})

module.exports = {
  get migrationsTable () {
    return 'adonis_migrations'
  },

  get connection () {
    return process.env.DB || 'sqlite3'
  },

  get sqlite3 () {
    return {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, './tmp/test.sqlite3')
      },
      useNullAsDefault: true,
      debug: false
    }
  },

  get mysql () {
    return {
      client: 'mysql',
      connection: {
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'default'
      }
    }
  },

  get pg () {
    return {
      client: 'pg',
      connection: {
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSSWORD || 'postgres',
        database: process.env.PG_DATABASE || 'default'
      }
    }
  }
}
