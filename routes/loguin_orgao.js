const express = require('express');
const mySQL = require('../sql/mysqlConfig').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/cadastro', (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        bcrypt.hash(req.body.senha, 10, (errBcrypt, senha_hash) => {
            if (errBcrypt) {
                res.status(500).json({ 'message': "Erro ErrBcrypt" })
            }
            conn.query(    
                'INSERT INTO tb_orgao (nome, uf, loguin, senha) VALUES (?, ?, ?, ?)',
                [req.body.nome, req.body.estado, req.body.loguin, senha_hash],
                (error, resultodo, field) => {
                    conn.release();
                    if(error) {
                        return res.status(500).send({
                            error : error,
                            response : null
                        });
                    }
                    res.status(200).send({
                        mensagem : 'Orgão cadastrado com sucesso',
                    })
                }
            )
        })
    })
});
router.post('/logar', (req, res, next) => { 
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'SELECT * FROM tb_orgao WHERE loguin = ?',
            [req.body.loguin],
            (error, resultodo, field) => {
                conn.release();
                if(error) {
                    return res.status(500).send({
                        error : error,
                    });
                }
                if(resultodo.length < 1){
                    return res.status(401).send({ message : 'Falha na autenticação'})
                }
                console.log(resultodo);
                bcrypt.compare(req.body.senha, resultodo[0].senha, (err, results) => {
                    if(err) {
                        return res.status(401).send({message : 'Falha na autenticação'})
                    }
                    if(results) {
                        let token = jwt.sign({
                            id: resultodo[0].id,
                            nome : resultodo[0].nome,
                            estado: resultodo[0].uf
                        },
                        "FimDaPicada",
                        {
                            expiresIn: "4h"
                        });
                        return res.status(200).send({
                            message : 'Autenticado com sucesso',
                            token : token,
                            nome : resultodo[0].nome,
                            estado: resultodo[0].uf
                        });
                    }
                    return res.status(401).send({message : 'Falha na autenticação'})
                })
            }
        )
    })
});

module.exports = router;