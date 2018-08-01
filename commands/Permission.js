'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require('@adonisjs/ace')
const Permission = use('Adonis/Acl/Permission')
const Database = use('Adonis/Src/Database')

class PermissionCommand extends Command {
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
    return 'acl:permission {slug} {name?} {description?}'
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  static get description () {
    return 'Create or update permission'
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
    let permission = await Permission.findBy('slug', slug)
    if (permission) {
      permission.merge({
        name, description
      })
      await permission.save()
    } else {
      permission = await Permission.create({ slug, name, description })
    }
    this.success(`${this.icon('success')} permission ${name} is updated.`)
    Database.close()
  }
}

module.exports = PermissionCommand
