const knex = require("../knex.js");

//tables

module.exports = {
  getAllUsers() {
    return knex("users").innerJoin(
      "personal_info",
      "users.id",
      "personal_info.user_id"
    );
  },
  getUserById(id) {
    return knex("users")
      .select(
        "id",
        "rol",
        "name",
        "last_name",
        "email",
        "country",
        "province",
        "location",
      )
      .where("id", id)
      .innerJoin("personal_info", "users.id", "personal_info.user_id")
      .first();
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

  updateUser(id, info) {
    return knex("users").where("id", id).update(info, "*");
  },
  updatePersonalInfo(id, info) {
    return knex("personal_info").where("user_id", id).update(info, "*");
  },
};
