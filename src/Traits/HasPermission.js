"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require("lodash");
const Acl = require("../Acl");

module.exports = class HasPermission {
  register(Model) {
    Model.prototype.permissions = function() {
      return this.belongsToMany("Adonis/Acl/Permission");
    };

    Model.prototype.getPermissions = async function({
      context_id,
      resource_id
    }) {
      let permissions = await this.permissions()
        .where("context_id", context_id)
        .where("resource_id", resource_id)
        .fetch();
      permissions = permissions.rows.map(({ slug }) => slug);
      if (typeof this.roles === "function") {
        const roles = await this.roles()
          .where("context_id", context_id)
          .where("resource_id", resource_id)
          .fetch();
        let rolesPermissions = [];
        for (let role of roles.rows) {
          const rolePermissions = await role.getPermissions();
          rolesPermissions = rolesPermissions.concat(rolePermissions);
        }
        permissions = _.uniq(permissions.concat(rolesPermissions));
      }
      return permissions;
    };

    Model.prototype.can = async function(expression, identifiers) {
      const permissions = await this.getPermissions(identifiers);
      return Acl.check(expression, operand => _.includes(permissions, operand));
    };

    Model.prototype.scope = async function(required) {
      const provided = await this.getPermissions();
      return Acl.validateScope(required, provided);
    };
  }
};
