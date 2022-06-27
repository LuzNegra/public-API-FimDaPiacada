const mySQL = require('mysql2');

var pool = mySQL.createPool({
    "user" : "b92b055864adf7",
    "password" : "17e41d97",
    "database" : "heroku_271576521d98587",
    "host" : "us-cdbr-east-05.cleardb.net",
    "port" : 3306
});

exports.pool = pool;