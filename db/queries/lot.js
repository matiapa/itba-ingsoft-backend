const knex = require("../knex.js");

module.exports = {
  getLotById(id) {
    return knex("lot")
    .innerJoin("name", "descripcion", "state")
    .where("id", id)
    .first();
  },

  getLotStatus(id) {
      return knex("lot")
      .innerJoin("status")
      .where("id", id)
      .first();
  },

  createLot(lot) {
      return knex("lot")
      .insert(lot, "id")
      .then((ids) => {
          return ids[0];
      });
  },

  deleteLot(id) {
      return knex("lot").where("id", id).del();
  },
  updateLot(id, info) {
      return knex("lot").where("id", id).update(info, "*");
  },

  createLotPhotos(lotP) {
      return knex("lot_photos")
      .insert(lotP, "lot_id")
      .then((ids) => {
          return ids[0];
      });
  }
};
