'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const bluebird = require('bluebird')

module.exports = {
  setupTables: function (knex) {
    const tables = [
      knex.schema.createTable('users', function (table) {
        table.increments()
        table.timestamps()
        table.string('username')
        table.string('email')
        table.string('password')
      }),
      knex.schema.createTable('permissions', function (table) {
        table.increments()
        table.string('slug').notNullable().unique()
        table.string('name').notNullable().unique()
        table.text('description').nullable()
        table.timestamps()
      }),
      knex.schema.createTable('permission_user', function (table) {
        table.increments()
        table.integer('permission_id').unsigned()
        table.integer('user_id').unsigned()
        table.timestamps()
      }),
      knex.schema.createTable('roles', function (table) {
        table.increments()
        table.string('slug').notNullable().unique()
        table.string('name').notNullable().unique()
        table.text('description').nullable()
        table.timestamps()
      }),
      knex.schema.createTable('role_user', function (table) {
        table.increments()
        table.integer('role_id').unsigned()
        table.integer('user_id').unsigned()
        table.timestamps()
      }),
      knex.schema.createTable('permission_role', function (table) {
        table.increments()
        table.integer('permission_id').unsigned()
        table.integer('role_id').unsigned()
        table.timestamps()
      })
    ]
    return bluebird.all(tables)
  },
  dropTables: function (knex) {
    const tables = [
      knex.schema.dropTableIfExists('permission_user'),
      knex.schema.dropTableIfExists('permission_role'),
      knex.schema.dropTableIfExists('role_user'),
      knex.schema.dropTableIfExists('users'),
      knex.schema.dropTableIfExists('permissions'),
      knex.schema.dropTableIfExists('roles')
    ]
    return bluebird.all(tables)
  },
  createRecords: function (knex, table, values) {
    return knex.table(table).insert(values).returning('id')
  },
  truncate: function (knex, table) {
    return knex.table(table).truncate()
  },
  up: async function (knex) {
    await this.setupTables(knex)
  },
  down: function (knex) {
    return this.dropTables(knex)
  }
}
