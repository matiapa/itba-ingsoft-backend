const knex = require("../knex.js");

module.exports = {
    addMessage(msg) {
        return knex("chat").insert(msg, "*");
    },
    getMessages(user_id, offset, limit) {
        return knex("chat")
        .select("*")
        .where("chat.from_id", user_id)
        .orWhere("to_id", user_id)
        .orderBy("date", "desc")
        .limit(limit)
        .offset(offset);
    },
}