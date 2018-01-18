'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

class Init {
  /**
   * Check the user acls. Since it will make the `acl`
   * instance available on each request.
   *
   * @method handle
   *
   * @param  {Object}   options.auth
   * @param  {Function} next
   *
   * @return {void}
   */
  async handle ({ auth, view }, next) {
    if (auth && auth.user && view && typeof (view.share) === 'function') {
      let user = auth.user
      let roles = []
      if (typeof user.getRoles === 'function') {
        roles = await user.getRoles()
      }
      let permissions = []
      if (typeof user.getPermissions === 'function') {
        permissions = await user.getPermissions()
      }
      view.share({
        acl: {
          roles, permissions
        }
      })
    }

    await next()
  }
}

module.exports = Init
