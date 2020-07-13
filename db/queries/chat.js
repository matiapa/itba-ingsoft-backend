const knex = require("../knex.js");

module.exports = {
    addMessage(msg) {
        return knex("chat").insert(msg, "*");
    },
    getMessages(user_id, chat_id, offset, limit) {
        return knex("chat")
        .select("*")
        .where("from_id", user_id)
        .andWhere("to_id", chat_id)
        .orWhere("from_id", chat_id)
        .andWhere("to_id", user_id)
        .orderBy("date", "desc")
        .limit(limit)
        .offset(offset);
    },
}