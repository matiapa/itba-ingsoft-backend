const knex = require("../knex.js");

//tables

module.exports = {
    addPhoto() {
        return knex("photo").insert({}, "id");
    },
    deletePhoto(id) {
        return knex("photo").where("id", id).del();
    }
};