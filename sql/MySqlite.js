const sqlite = require ('sqlite3');

const DB_Fim_da_Picada = './sql/Fim_Da_Picada.db';
const db = new sqlite.Database(DB_Fim_da_Picada, err => {
	if(err){
		return console.error(err.message);
	}
	console.log("Conexão bem sucessedida com o sevidor do Fim Da Picada")
});

module.exports = db;