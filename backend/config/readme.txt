var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
});

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./multisig.sqlite"
  }
});


original:

var knex = require('knex')({
											client: 'mysql',
											connection: dbConfig
										});
var dbConfig = {
		host     : '',
    user     : '',
    password : '',
    database : '',
    charset  : ''
  };

module.exports  =  dbConfig;
