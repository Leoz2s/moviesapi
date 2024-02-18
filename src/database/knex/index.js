const config = require("../../../knexfile.js");
const knex = require('knex');

const knexConnection = knex(config.development);

module.exports = knexConnection;