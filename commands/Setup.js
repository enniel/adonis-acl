'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require('@adonisjs/ace')
const path = require('path')
const _ = require('lodash')
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
   * Returns file name for the schema migration file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name) {
    return `${_.upperFirst(_.camelCase(name))}`
  }

  /**
   * Returns file path for the schema migration file
   *
   * @method getFilePath
   *
   * @param  {String}  name
   *
   * @return {String}
   */
  getFilePath (name) {
    const fileName = `${new Date().getTime()}_${_.snakeCase(this.getFileName(name))}`
    return Helpers.migrationsPath(`${fileName}.js`)
  }

  /**
   * Generates the blueprint for a given resources
   * using pre-defined template
   *
   * @method generateBlueprint
   *
   * @param  {String}         templateFor
   * @param  {String}         name
   *
   * @return {void}
   */
  async generateBlueprint (templateFor, name) {
    const templateFile = path.join(__dirname, './templates', `${templateFor}.mustache`)

    const filePath = this.getFilePath(name)

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
      await this.generateBlueprint('permission_role_schema', 'create_permission_role_table')
      await this.generateBlueprint('permission_user_schema', 'create_permission_user_table')
      await this.generateBlueprint('permissions_schema', 'create_permissions_table')
      await this.generateBlueprint('role_user_schema', 'create_role_user_table')
      await this.generateBlueprint('roles_schema', 'create_roles_table')
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = SetupCommand
