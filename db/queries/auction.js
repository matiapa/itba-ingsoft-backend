const knex = require("../knex.js");
const { assert } = require("joi");

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
        "deadline",
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

  getAuctions() {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "deadline",
        "owner_id",
        "name",
        "category",
        "description",
        "initial_price",
        "quantity",
        "state"
      )
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id");
  },
  sort(auctions, category = null, sort = null) {
    var res = auctions;
    if (category != null) {
      res = res.where("category", category);
    }
    if (sort != null) {
      switch (sort) {
        case "popularity":
          res = res
            .leftJoin("bid", "lot_id", "bid.auc_id")
            .groupBy(
              "lot_id",
              "creation_date",
              "deadline",
              "owner_id",
              "name",
              "category",
              "description",
              "state"
            )
            .orderBy(knex.raw("count(*)"), "desc");

          break;

        case "deadline":
          res = res.orderBy(sort, "asc");
          break;

        case "creation_date":
          res = res.orderBy(sort, "desc");
      }
    }
    return res;
  },

  filterBiddingOn(auctions, user_id) {
    return auctions
      .innerJoin("bid", "bid.auc_id", "auction.lot_id")
      .where("bid.user_id", user_id);
  },

  //auction por owner_id
  getAuctionByOwnerId(owner_id) {
    return knex()
      .select(
        "lot_id",
        "creation_date",
        "deadline",
        "name",
        "category",
        "description",
        "state"
      )
      .from("lot")
      .innerJoin("auction", "lot.id", "auction.lot_id")
      .where("owner_id", owner_id);
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
      .modify((query) => {
        return category == null ? query : query.where("category", category);
      })
      .limit(limit)
      .offset(offset);
  },

  //     auctions ordenados por cantidad de bids,  podes dar category para filtrar,
  //   offset: numero de auction desde la cual muestra (para devolver por pagina),
  // limit: cantidad de auctions que devuelve (devolver 1 pagina)
  getAuctionsOrderByPopularity(category = null) {
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
      .leftJoin("bid", "lot_id", "bid.auc_id")
      .groupBy(
        "lot_id",
        "creation_date",
        "deadline",
        "owner_id",
        "name",
        "category",
        "description",
        "state"
      )
      .orderBy(knex.raw("count(*)"), "desc")
      .modify((query) => {
        return category == null ? query : query.where("category", category);
      })
      .limit(limit)
      .offset(offset);
  },
  //auctions ordenados por cration date descendiente,  podes dar category para filtrar,
  //offset: numero de auction desde la cual muestra (para devolver por pagina),
  //limit: cantidad de auctions que devuelve (devolver 1 pagina)
  getAuctionsOrderByCreationDate(category = null, offset = null, limit = null) {
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
      .orderBy("creation_date", "desc")
      .modify((query) => {
        return category == null ? query : query.where("category", category);
      })
      .limit(limit)
      .offset(offset);
  },
};
