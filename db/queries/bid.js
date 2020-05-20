const knex = require("../knex.js");

module.exports = {
  getBidById(id) {
      return knex("bid")
      .innerJoin("bid.ar_id", "bid.amount", "bid.time")
      .where("id", id)
      .first();
  },
  
  createBid(bid) {
    return knex("bid")
    .insert(bid, "ar_id")
    .then((ids) => {
        return ids[0];
    });
  },
/*
  deleteBid(ar_id) {
      return knex("bid").where("ar_id", ar_id).del();
  },
*/
  updateBid(ar_id, info) {
      return knex("bid").where("ar_id", ar_id).update(info, "*");
  },
};
