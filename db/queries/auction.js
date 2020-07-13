const knex = require("../knex.js");
const { assert } = require("joi");
const lot = require("./lot.js");

//tables

function getOpenAuctions()
{
  return knex("lot")
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
  .innerJoin("auction", "lot.id", "auction.lot_id")
  .where("state", "APPROVED");
}

module.exports = {
  async createAuction(info) {
    await lot.updateLot(info.lot_id, {state: "APPROVED"});
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
      "initial_price",
      "quantity",
      "state"
    )
    .from("lot")
    .innerJoin("auction", "lot.id", "auction.lot_id")
    .where("lot.id", id)
    .first();
  },

  getAuctionsBiddingOn(user_id, offset = null, limit = null) {
    return getOpenAuctions()
      .innerJoin("bid", "bid.auc_id", "auction.lot_id")
      .where("bid.user_id", user_id)
      .orderBy("deadline", "asc")
      .limit(limit)
      .offset(offset)
      .distinct();
  },

  //auction por owner_id
  getAuctionByOwnerId(owner_id) {
    return getOpenAuctions()
      .where("owner_id", owner_id);
  },
  //auctions ordenados por cual termina antes,  podes dar category para filtrar,
  //offset: numero de auction desde la cual muestra (para devolver por pagina),
  //limit: cantidad de auctions que devuelve (devolver 1 pagina)
  getAuctionsOrderByDeadline(category = null, offset = null, limit = null) {
    return getOpenAuctions()
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
  getAuctionsOrderByPopularity(category = null, offset = null, limit = null) {
    return getOpenAuctions()
      .leftJoin("bid", "lot_id", "bid.auc_id")
      .groupBy(
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
    return getOpenAuctions()
      .orderBy("creation_date", "desc")
      .modify((query) => {
        return category == null ? query : query.where("category", category);
      })
      .limit(limit)
      .offset(offset);
  },
  closeAuction(id) {
    return knex("lot")
      .where("id", id)
      .update({state:"CLOSED"});
  }
};
