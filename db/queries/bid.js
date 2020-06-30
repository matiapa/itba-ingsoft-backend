const knex = require("../knex.js");

//tables

module.exports = {
  createBid(info) {
    return knex("bit").insert(info, "*");
  },

  deleteBid(auc_id) {
    return knex("bid").where("auc_id", auc_id).del();
  },

  getBidById(user_id) {
    return knex()
      .select("id", "user_id", "auc_id", "amount", "time")
      .from("bid")
      .innerJoin("personal_info", "personal_info.user_id", "bid.user_id")
      .where("bid.user_id", user_id)
      .first();
  },
};
