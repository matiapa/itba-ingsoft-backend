const knex = require("../knex.js");

//tables

module.exports = {
  getAllUsers() {
    return knex("users");
  },
  getUserById(id) {
    return knex("users").where("id", id).first();
  },
  getUserByEmail(email) {
    return knex("users").where("email", email).first();
  },
  createUser(user) {
    return knex("users")
      .insert(user, "id")
      .then((ids) => {
        return ids[0];
      });
  },
  deleteUser(id) {
    return knex("users").where("id", id).del();
  },
  createPersonalInfo(info) {
    return knex("personal_info").insert(info, "*");
  },
  getPersonalInfo(id) {
    return knex("personal_info").where("user_id", id).first();
  },
};
