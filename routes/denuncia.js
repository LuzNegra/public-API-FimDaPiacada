const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mySQL = require('../sql/mysqlConfig').pool;
const router = express.Router();
const loguin = require('../middleware/loguin');

router.get('/:id_protocolo', (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'SELECT tb_endereco.cep, tb_endereco.estado, tb_endereco.cidade, tb_endereco.bairro, tb_endereco.rua, tb_endereco.numero, tb_denuncia.completamento, tb_denuncia.descricao FROM tb_denuncia INNER JOIN tb_endereco ON tb_denuncia.endereco = tb_endereco.id WHERE tb_denuncia.protocolo = ?',
            [req.params.id_protocolo],
            (error, resultado, fields) => {
                conn.release()
                if(error) {
                    return res.status(500).send({error : error})
                }
                return res.status(200).send(resultado[0])
            }
        )
    })
});

router.get('/buscar/:uf', loguin.obrigatorio, (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'SELECT cep, cidade, estado, bairro, rua, numero, completamento, descricao FROM tb_denuncia INNER JOIN tb_endereco ON tb_endereco.estado = ? AND tb_denuncia.denuncia_status = "Não Verificado" AND tb_denuncia.endereco = tb_endereco.id',
            [req.params.uf],
            (error, resultado, fields) => {
                conn.release();
                if(error) {
                    res.status(500).send({error:error});
                }
                if(resultado.length > 0){
                    return res.status(200).send({retorno : resultado})
                }else{
                    return res.status(200).send({retorno : resultado})
                }
            }
        )
    });
});

router.put('/status/:EnderecoID', loguin.obrigatorio, (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        console.log(req.params.EnderecoID)
        conn.query(
            'UPDATE tb_denuncia set denuncia_status = "Verificado" WHERE endereco = ? AND denuncia_status = "Não verificado"',
            [req.params.EnderecoID],
            (error, resultodo, field) => {
                conn.release();
                if(error) {
                    return res.status(500).send({
                        error : error,
                        response : null
                    });
                }
                res.status(200).send({
                    mensagem : 'Status alterado com sucesso'
                })
            }
        )
    })
    /*
    const sql = 'UPDATE tb_Denuncia set status = "Verificado" WHERE endereco = ? AND status = ?';    const parametros = [req.params.EnderecoID, "Não Verificado"]
    db.run(sql, parametros, err => {        if(err){
            res.status(500).send({                messagem: "Erro ao alterar denúncias"
            })        }
        res.status(200).send({
            messagem: "Alteração da denúncia realizada com sucesso para " + parametros[1]
        })
    });*/
    
})

router.post('/cadastrar', (req, res, next) => {
    mySQL.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({ error : error})
        }
        conn.query(
            'INSERT INTO tb_denuncia (endereco, completamento, descricao, protocolo) VALUES (?, ?, ?, ?)',
            [req.body.endereco, req.body.complemento, req.body.descricao, req.body.protocolo],
            (error, resultodo, field) => {
                conn.release();
                if(error) {
                    return res.status(500).send({
                        error : error,
                        response : null
                    });
                }
                res.status(200).send({
                    mensagem : 'Denúncia cadastrado com sucesso',
                    protocolo : req.body.protocolo
                })
            }
        )
    })
});
module.exports = router;