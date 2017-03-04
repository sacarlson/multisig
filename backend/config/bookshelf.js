var dbConfig = require('./database');

//var knex = require('knex')({
//	client: 'mysql',
//	connection: dbConfig
//});

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./multisig.sqlite"
  }
});

module.exports = require('bookshelf')(knex);
