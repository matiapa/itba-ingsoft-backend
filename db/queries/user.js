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
        "location"
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

  getProfileRatings(user_id) {
    return knex()
      .select("to_id", "from_id", "comment", "rating", "date")
      .from("user_rating")
      .where("to_id", user_id);
  },

  postProfileRating(info) {
    return knex("user_rating").insert(info, "*");
  },

  getFollowing(follower_id, followed_id) {
    return knex("following")
      .where("follower_id", follower_id)
      .andWhere("followed_id", followed_id);
  },
  postFollowing(follower_id, followed_id) {
    return knex("following").insert(
      {
        followed_id: followed_id,
        follower_id: follower_id,
      },
      "*"
    );
  },
  deleteFollowing(follower_id, followed_id) {
    return knex("following")
      .where("follower_id", follower_id)
      .andWhere("followed_id", followed_id)
      .del();
  },
};
