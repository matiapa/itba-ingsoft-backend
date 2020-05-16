const knex = require("../knex.js");

//tables

module.exports = {
  createExpert(info) {
    return knex("expert").insert(info, "*");
  },

  deleteExpert(id) {
    return knex("expert").where("id", id).del();
  },
  updateExpert(id, info) {
    return knex("expert").where("id", id).update(info, "*");
  },
  asignAuction(info) {
    return knex("expert_asign").insert(info, "*");
  },
  //cambiar estado de lot puede hacerlo con la query update de lot
};
