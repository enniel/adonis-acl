'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require('@adonisjs/ace')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')
const Database = use('Adonis/Src/Database')
const _ = require('lodash')

class RoleCommand extends Command {
  /**
   * The command signature getter to define the
   * command name, arguments and options.
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature () {
    return 'acl:role {slug} {name?} {description?} {--permissions=@value}'
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  get description () {
    return 'Create or update role'
  }

  /**
   * The handle method to be executed
   * when running command
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle ({ slug, name, description }, { permissions }) {
    name = name || slug
    let role = await Role.findBy('slug', slug)
    if (role) {
      role.merge({
        name, description
      })
      await role.save()
    } else {
      role = await Role.create({
        slug, name, description
      })
    }
    permissions = _.reduce(_.split(permissions, ','), (result, permission) => {
      permission = _.trim(permission)
      if (permission.length) {
        result.push(permission)
      }
      return result
    }, [])
    for (let i in permissions) {
      const permission = permissions[i]
      let entry = await Permission.findBy('slug', permission)
      if (!entry) {
        entry = await Permission.create({
          slug: permission, name: permission
        })
      }
      permissions[i] = entry.id
    }
    if (permissions.length) {
      await role.permissions().attach(permissions)
    }
    this.success(`${this.icon('success')} role ${name} is updated.`)
    Database.close()
    return role
  }
}

module.exports = RoleCommand
