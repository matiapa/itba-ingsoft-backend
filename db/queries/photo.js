const knex = require("../knex.js");

//tables

module.exports = {
    addPhoto(uid) {
        return knex("photo").insert({owner_id: uid}, "id");
    },
    searchPhoto(id) {
        return knex("photo").where("id", id).first();
    },
    deletePhoto(id) {
        return knex("photo").where("id", id).del();
    }
};