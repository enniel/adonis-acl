'use strict'

const Ioc = require('adonis-fold').Ioc
const Command = Ioc.use('Adonis/Src/Command')
const Role = Ioc.use('Adonis/Acl/Role')
const Permission = Ioc.use('Adonis/Acl/Permission')
const Database = Ioc.use('Adonis/Src/Database')
const series = require('co-series')
const _ = require('lodash')

class RoleCommand extends Command {
  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return 'acl:role {slug} {name?} {description?} {--permissions=@value}'
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Create or update role'
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
    let role = yield Role.query().where('slug', slug).first()
    if (!role) {
      role = new Role({ slug })
    }
    role.fill({
      name, description
    })
    yield role.save()
    permissions = _.reduce(_.split(permissions, ','), (result, permission) => {
      permission = _.trim(permission)
      if (permission.length) {
        result.push(permission)
      }
      return result
    }, [])
    permissions = yield _.map(permissions, series(function * (permission) {
      let entry = yield Permission.query().where('slug', permission).first()
      if (!entry) {
        entry = yield Permission.create({
          slug: permission, name: permission
        })
      }
      return entry.id
    }))
    if (permissions.length) {
      yield role.permissions().sync(permissions)
    }
    this.success(`${this.icon('success')} role ${name} is updated.`)
    Database.close()
  }
}

module.exports = RoleCommand
