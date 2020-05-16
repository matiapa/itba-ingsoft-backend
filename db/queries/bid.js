const knex = require("../knex.js");

//tables

module.exports = {
  createBid(info) {
    return knex("lot").insert(info, "*");
  },

  deleteBid(auc_id) {
    return knex("bid").where("auc_id", auc_id).del();
  },
  getBidById(user_id) {
    return knex("bid").where("user_id", user_id);
  },
};
