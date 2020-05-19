const knex = require("../knex.js");

//tables

module.exports = {
  createAuction(info) {
    return knex("auction").insert(info);
  },
  //auction por lot id
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
  //auction por owner_id
  getAuctionByOwnerId(owner_id) {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "duration",
        "name",
        "category",
        "description",
        "state"
      )
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id")
      .where("owner_id", owner_id)
      .first();
  },
  //auctions ordenados por cual termina antes,  podes dar category para filtrar,
  //offset: numero de auction desde la cual muestra (para devolver por pagina),
  //limit: cantidad de auctions que devuelve (devolver 1 pagina)
  getAuctionsOrderByDeadline(category = null, offset = null, limit = null) {
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

  //     auctions ordenados por cantidad de bids,  podes dar category para filtrar,
  //   offset: numero de auction desde la cual muestra (para devolver por pagina),
  // limit: cantidad de auctions que devuelve (devolver 1 pagina)
  getAuctionsOrderByPopularity(category = null, offset = null, limit = null) {
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
