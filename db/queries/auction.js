const knex = require("../knex.js");



module.exports = {
  getAutionById(id) {
    return knex("auction")
    .innerJoin("auction.category", "auction.name")
    .where("id", id)
    .first();
  },

  createAuction(auction){
      return knex("auction")
      .insert(auction, "id")
      .then((ids) => {
          returnids[0];
      });
  },

  deleteAuction(id) {
      return knex("auction").where("id", id).del();
  },

  updateAuction(id, info){
      return knex("auction").where("id", id).update(info, "*");
  },
};
