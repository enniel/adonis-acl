'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require('@adonisjs/ace')
const path = require('path')
const Helpers = use('Adonis/Src/Helpers')

class SetupCommand extends Command {
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
    return 'acl:setup'
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
    return 'Setup migration for ACL'
  }

  /**
   * Generates the blueprint for a given resources
   * using pre-defined template
   *
   * @method generateBlueprint
   *
   * @param  {String}         name
   *
   * @return {void}
   */
  async generateBlueprint (name) {
    const templateFile = path.join(__dirname, './templates', `${name}.mustache`)
    const fileName = `${new Date().getTime()}_${name}`
    const filePath = Helpers.migrationsPath(`${fileName}.js`)

    const templateContents = await this.readFile(templateFile, 'utf-8')
    await this.generateFile(filePath, templateContents)

    const createdFile = filePath.replace(Helpers.appRoot(), '').replace(path.sep, '')
    console.log(`${this.icon('success')} ${this.chalk.green('create')} ${createdFile}`)
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
  async handle () {
    try {
      await this.generateBlueprint('create_permissions_table')
      await this.generateBlueprint('create_roles_table')
      await this.generateBlueprint('create_permission_role_table')
      await this.generateBlueprint('create_permission_user_table')
      await this.generateBlueprint('create_role_user_table')
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = SetupCommand
