const knex = require("../knex.js");

//tables

module.exports = {
  createLot(info) {
    return knex("lot").insert(info, "*");
  },
  updateLot(id, info) {
    return knex("lot").where("id", id).update(info, "*");
  },
  deleteLot(id) {
    return knex("lot").where("id", id).del();
  },
};
