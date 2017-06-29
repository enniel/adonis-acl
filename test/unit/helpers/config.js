'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../../../.env')})

module.exports = {
  get: key => {
    if (key === 'database.migrationsTable') {
      return 'adonis_migrations'
    }

    if (key === 'database.connection') {
      return process.env.DB
    }

    if (key === 'database.sqlite3') {
      return {
        client: 'sqlite3',
        connection: {
          filename: path.join(__dirname, '../storage/test.sqlite3')
        },
        useNullAsDefault: true,
        debug: false
      }
    }

    if (key === 'database.mysql') {
      return {
        client: 'mysql',
        connection: {
          user: process.env.MYSQL_USER || 'root',
          password: process.env.MYSQL_PASSWORD || 'root',
          database: process.env.MYSQL_DATABASE || 'default'
        }
      }
    }

    if (key === 'database.pg') {
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
}
