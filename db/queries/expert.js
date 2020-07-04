const knex = require("../knex.js");

//tables

module.exports = {
  createExpert(info) {
    return knex("expert").insert(info, "*");
  },

  getExperts() {
    return knex("expert");
  },

  getAsignedExperts() {
    return knex("expert_asign");
  },

  getExpertById(id) {
    return knex("expert").where("id", id).first();
  },

  deleteExpert(id) {
    return knex("expert").where("id", id).del();
  },
  updateExpert(id, info) {
    return knex("expert").where("id", id).update(info, "*");
  },
  asignExpert(info) {
    return knex("expert_asign").insert(info, "*");
  },
  getExpertAsigned(auc_id) {
    return knex()
      .select("name", "last_name", "category")
      .from("expert")
      .innerJoin("expert_asign", "expert.id", "expert_asign.id_exp")
      .where("expert_asign.id_auc", auc_id);
  },
  //cambiar estado de lot puede hacerlo con la query update de lot
};
