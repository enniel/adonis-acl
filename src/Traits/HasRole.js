"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require("lodash");
const Acl = require("../Acl");

module.exports = class HasRole {
  register(Model) {
    Model.prototype.roles = function() {
      return this.belongsToMany("Adonis/Acl/Role");
    };

    Model.prototype.getRoles = async function({ context_id, resource_id }) {
      const roles = await this.roles()
        .where("context_id", context_id)
        .where("resource_id", resource_id)
        .fetch();
      return roles.rows.map(({ slug }) => slug);
    };

    Model.prototype.is = async function(expression, identifiers) {
      const roles = await this.getRoles(iden);
      return Acl.check(expression, operand => _.includes(roles, operand));
    };
  }
};
