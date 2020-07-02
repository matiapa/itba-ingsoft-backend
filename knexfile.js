//require('dotenv').config();
const pg = require("pg");

pg.defaults.ssl = true;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
module.exports = JSON.parse(process.env.KNEX_CREDENTIALS)