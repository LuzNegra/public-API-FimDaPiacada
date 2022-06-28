const express = require('express');
const router = express.Router();
const mySQL = require('../sql/mysqlConfig').pool;

router.post('/procurar', (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'SELECT id FROM tb_endereco WHERE cep = ? AND estado = ? AND cidade = ? AND bairro = ? AND rua = ? AND numero = ?',
            [req.body.cep, req.body.estado, req.body.cidade, req.body.bairro, req.body.rua, req.body.numero],
            (error, resultado, field) => {
                conn.release()
                if(error) {
                    return res.status(500).send({error:error})
                }
                if(resultado.length > 0){
                    return res.status(200).send(resultado[0])
                }else{
                    return res.status(200).send({id : -1})
                }
            }
        )
    });
});

router.post('/cadastrar', (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'INSERT INTO tb_endereco (cep, estado, cidade, bairro, rua, numero) VALUES (?, ?, ?, ?, ?, ?)',
            [req.body.cep, req.body.estado, req.body.cidade, req.body.bairro, req.body.rua, req.body.numero],
            (error, resultodo, field) => {
                conn.release();
                if(error) {
                    return res.status(500).send({
                        error : error,
                        response : null
                    });
                }
                res.status(200).send({
                    mensagem : 'Endereço cadastrado com sucesso',
                    id : resultodo.insertId
                })
            }
        )
    })
});

module.exports = router;