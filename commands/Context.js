"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require("@adonisjs/ace");
const Context = use("Adonis/Acl/Context");
const Database = use("Adonis/Src/Database");

class ContextCommand extends Command {
  /**
   * The command signature getter to define the
   * command name, arguments and options.
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature() {
    return "acl:context {slug} {name?} {description?}";
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  static get description() {
    return "Create or update context";
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
  async handle({ slug, name, description }, { contexts }) {
    name = name || slug;
    let context = await Context.findBy("slug", slug);
    if (context) {
      context.merge({
        name,
        description
      });
      await context.save();
    } else {
      context = await Context.create({ slug, name, description });
    }
    this.success(`${this.icon("success")} context ${name} is updated.`);
    Database.close();
  }
}

module.exports = ContextCommand;
