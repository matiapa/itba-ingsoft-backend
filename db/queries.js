const knex = require("./knex.js");

//tables
const Users = knex("users");

module.exports = {
  getAllUsers() {
    return knex("users");
  },
  getUserById(id) {
    return knex("users").where("id", id).first();
  },
  createUser(user) {
    return knex("users").insert(user, "*");
  },
  deleteUser(id) {
    return knex("users").where("id", id).del();
  },
  createPersonalInfo(info) {
    return knex("personal_info").insert(info, "*");
  },
};
