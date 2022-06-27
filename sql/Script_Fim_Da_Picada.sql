CREATE TABLE IF NOT EXISTS "tb_Endereco" (
	"endereco_id"	INTEGER NOT NULL,
	"endereco_cep"	TEXT(8) NOT NULL,
	"endereco_num"	INTEGER NOT NULL,
	"endereco_rua"	VARCHAR(100) NOT NULL,
	"endereco_uf"	INTEGER NOT NULL,
	"endereco_complemento"	INTEGER NOT NULL,
	PRIMARY KEY("endereco_id")
);
CREATE TABLE IF NOT EXISTS "tb_Denuncia" (
	"denuncia_id"	INTEGER NOT NULL,
	"descricao"	TEXT NOT NULL,
	"endereco"	INTEGER NOT NULL,
	"protocolo"	INTEGER(8) NOT NULL UNIQUE,
	"status"	VARCHAR(20) NOT NULL,
	FOREIGN KEY("endereco") REFERENCES "tb_Endereco"("endereco_id"),
	PRIMARY KEY("denuncia_id")
);
CREATE TABLE IF NOT EXISTS "tb_Funcionario" (
	"funcionario_id"	INTEGER NOT NULL,
	"funcionario_nome"	VARCHAR(50) NOT NULL,
	"funcionario_fone"	INTEGER(13) NOT NULL,
	"id_orgao"	INTEGER NOT NULL,
	FOREIGN KEY("id_orgao") REFERENCES "tb_Orgao_responsavel"("orgao_id"),
	PRIMARY KEY("funcionario_id")
);
CREATE TABLE IF NOT EXISTS "tb_Orgao_responsavel" (
	"orgao_id"	INTEGER NOT NULL,
	"orgao_nome"	VARCHAR(50) NOT NULL,
	"uf"	INTEGER NOT NULL,
	"login"	INTEGER NOT NULL,
	"senha"	INTEGER NOT NULL,
	PRIMARY KEY("orgao_id")
);
