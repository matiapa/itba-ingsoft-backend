const knex = require("../knex.js");

//tables

module.exports = {
  createBid(info) {
    return knex("bid").insert(info, "*");
  },

  deleteBid(auc_id) {
    return knex("bid").where("auc_id", auc_id).del();
  },
  getBidByUserId(user_id, offset, limit) {
    return knex("bid").where("user_id", user_id).limit(limit).offset(offset);
  },
  getBidsByAuctionId(auc_id, offset = null, limit = null) {
    return knex("bid")
      .select("user_id", "auc_id", "amount", "time")
      .where("auc_id", auc_id)
      .orderBy("amount", "desc")
      .limit(limit)
      .offset(offset);
  },
  getHighestBid(auc_id) {
    return this.getBidsByAuctionId(auc_id).first();
  }
};
