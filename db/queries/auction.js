const knex = require("../knex.js");

//tables

module.exports = {
  createAuction(info) {
    return knex("auction").insert(info);
  },
  getAuctionById(id) {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "duration",
        "owner_id",
        "name",
        "category",
        "description",
        "state"
      )
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id")
      .where("lot.id", id)
      .first();
  },
  getAuctionOrderByDeadline(category = null, offset = null, limit = null) {
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
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id")
      .orderBy("deadline", "asc")
      .then((query) => {
        return category == null ? query : query.where("category", category);
      })
      .then((query) => {
        return query.limit(limit).offset(offset);
      });
  },
  getAuctionOrderByPopularity(category = null, offset = null, limit = null) {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "deadline",
        "owner_id",
        "name",
        "category",
        "description",
        "state",
        knex.raw("count(*) as bid_count")
      )
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id")
      .then((query) => {
        return category == null ? query : query.where("category", category);
      })
      .then((query) => {
        return query
          .groupBy("lot_id")
          .orderBy("bid_count", "desc")
          .limit(limit)
          .offset(offset);
      });
  },
};
