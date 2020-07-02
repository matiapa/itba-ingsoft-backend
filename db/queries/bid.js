const knex = require("../knex.js");

//tables

module.exports = {
  createBid(info) {
    return knex("bid").insert(info, "*");
  },

  deleteBid(auc_id) {
    return knex("bid").where("auc_id", auc_id).del();
  },
  getBidByUserId(user_id) {
    return knex("bid").where("user_id", user_id);
  },
  getBidsByAuctionId(auc_id, offset, limit) {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "deadline",
        "owner_id",
        "name",
        "category",
        "description",
        "state"
      )
      .from("bid")
      .innerJoin("auction", "bid.auc_id", "auction.lot_id")
      .where("auc_id", auc_id)
      .orderBy(time, desc)
      .limit(limit)
      .offset(offset);
  },
};
