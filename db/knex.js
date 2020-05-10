const environment = process.env.ENVIRONMENT || "development";
const config = require("../knexfile.json")[environment];
module.exports = require("knex")(config);
