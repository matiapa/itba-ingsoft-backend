const knex = require("../knex.js");
const fs = require("fs");

module.exports = {
    async addPhoto(uid, file) {
        var buffer = fs.readFileSync(file);
        return knex("photo").insert({
            owner_id: uid,
            data: buffer
        }, "id");
    },
    getPhoto(id) {
        return knex("photo").select("data").where("id", id).first()
    },
    searchPhoto(id) {
        return knex("photo").where("id", id).first();
    },
    deletePhoto(id) {
        return knex("photo").where("id", id).del();
    }
};