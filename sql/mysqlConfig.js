const mySQL = require('mysql2');

var pool = mySQL.createPool({
    "user" : "root",
    "password" : "admin",
    "database" : "fim_da_picada",
    "host" : "localhost",
    "port" : 3306
});

exports.pool = pool;