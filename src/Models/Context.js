"use strict";
const Model = use("Adonis/Src/Model");

class Context extends Model {
  static get rules() {
    return {
      slug: "required|min:3|max:255|regex:^[a-zA-Z0-9_-]+$",
      name: "required|min:3|max:255",
      description: "min:3|max:1000"
    };
  }
}

module.exports = Context;
