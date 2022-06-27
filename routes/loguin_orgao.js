const express = require('express');
const db = require('../sql/MySqlite');
const sqlite = require('../sql/MySqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      rota: "loguin"
    })
})

router.post('/cadastro', (req, res, next) => {
    const sql = 'INSERT INTO tb_Orgao_responsavel (orgao_nome, uf, login, senha) VALUES (?, ?, ?, ?)'
    const sqlSelect = 'SELECT orgao_id FROM tb_Orgao_responsavel WHERE orgao_nome = ? AND uf = ? AND login = ?'
    const orgaoSelect = [req.body.nome, req.body.uf, req.body.loguin];
    let result = [];
    db.all(sqlSelect, orgaoSelect, (err, rows) => {
        if (err) {
            res.status(500).send({
                messagem: 'Erro ao cadastrar orgão',
                error: err,
            })
        }
        rows.forEach((row) => {
            result.push(row);
        })
        if (result.length > 0) {
            res.status(200).send({
                messagem: 'Orgão ja cadastrado'
            })
        } else {
            bcrypt.hash(req.body.senha, 10, (errBcrypt, senha_hash) => {
                if (errBcrypt) {
                    res.status(500).json({ 'message': "Erro ErrBcrypt" })
                }
                const orgao = [req.body.nome, req.body.uf, req.body.loguin, senha_hash];
                db.run(sql, orgao, err => {
                    if (err) {
                        res.status(500).send({
                            messagem: 'Erro ao cadastrar orgão',
                            error: err,
                        })
                    }
                    res.status(200).send({
                        messagem: 'Orgão cadastrado com sucesso'
                    })
                });

            })
        }
    })
});
router.post('/logar', (req, res, next) => {
    const sql = 'SELECT * FROM tb_Orgao_responsavel WHERE login = ?'
    const loguin = req.body.loguin;
    const senha = req.body.senha;
    let dadosBD = [];
    db.all(sql, loguin, (err, rows) => {
        if (err) {
            res.status(500).send({
                messagem: 'Erro ao logar',
                error: err
            })
        }
        rows.forEach((row) => {
            dadosBD.push(row);
        })
        if (dadosBD.length === 0) {
            res.status(200).send({
                messagem: 'Erro ao logar'
            })
        } else {
            bcrypt.compare(senha, dadosBD[0].senha, (err, retorno) => {
                if (err) {
                    res.status(401).send({
                        message: 'falha na autenticação'
                    });
                }
                if (retorno) {
                    const orgaoDados = [dadosBD[0].orgao_nome, dadosBD[0].uf]
                    const JWT_KEY = "ChaveFimDaPicada";
                    let token = jwt.sign({
                        id_orgao: dadosBD[0].orgao_id,
                        nome: dadosBD[0].orgao_nome,
                        uf: dadosBD[0].uf
                    }, JWT_KEY,
                    {
                        expiresIn: "1H"
                    });
                    return res.status(200).send({
                        message: 'autenticado com sucesso',
                        token: token
                    })
                }else{
                    res.status(401).send({
                        message: 'falha na autenticação'
                    });
                }
            })
        }
    })
});

module.exports = router;