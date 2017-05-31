'use strict'

const Ioc = require('adonis-fold').Ioc
const Command = Ioc.use('Adonis/Src/Command')
const Permission = Ioc.use('Adonis/Acl/Permission')
const Database = Ioc.use('Adonis/Src/Database')

class PermissionCommand extends Command {
  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return 'acl:permission {slug} {name?} {description?}'
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Create or update permission'
  }

  /**
   * handle method is invoked automatically by ace, once your
   * command has been executed.
   *
   * @param  {Object} args    [description]
   * @param  {Object} options [description]
   */
  * handle ({ slug, name, description }, { permissions }) {
    name = name || slug
    let permission = yield Permission.query().where('slug', slug).first()
    if (!permission) {
      permission = new Permission({ slug })
    }
    permission.fill({
      name, description
    })
    yield permission.save()
    this.success(`${this.icon('success')} permission ${name} is updated.`)
    Database.close()
  }
}

module.exports = PermissionCommand
