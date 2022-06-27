const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const db = require('../sql/MySqlite');
const mySQL = require('../sql/mysqlConfig').pool;
const router = express.Router();
const loguin = require('../middleware/loguin');

router.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      rota: "denúncia"
    })
})
router.get('/:id_protocolo', (req, res, next) => {
    console.log(req.params.id_protocolo);
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

router.get('/buscar/uf', loguin.obrigatorio ,(req, res, next) => {
    const uf = req.orgao.uf;
    const sql = 'SELECT descricao, endereco_cep, endereco_num, endereco_rua, endereco_uf, status FROM tb_Denuncia INNER JOIN tb_Endereco ON tb_Endereco.endereco_uf = ? AND tb_Denuncia.status = "Não Verificado"';
    let result = [];
    db.all(sql, uf, (err, rows) => {
        if(err){
            res.status(500).send({
                messagem: 'Erro ao procurar a denuncia',
                error: err
            })
        }
        rows.forEach((row) => {
            result.push(row);
        })
        if(result.length === 0){
            res.status(200).send({
                messagem: "Denúncia não encontrado",
                uf: uf
            })
        }else{
            res.status(200).send({
                messagem: "Denúncia encontrado",
                retorno: result
            })
        }
    });
});

router.put('/status/:EnderecoID', loguin.obrigatorio, (req, res, next) => {
    const sql = 'UPDATE tb_Denuncia set status = "Verificado" WHERE endereco = ? AND status = ?';
    const parametros = [req.params.EnderecoID, "Não Verificado"]
    db.run(sql, parametros, err => {
        if(err){
            res.status(500).send({
                messagem: "Erro ao alterar denúncias"
            })
        }
        res.status(200).send({
            messagem: "Alteração da denúncia realizada com sucesso para " + parametros[1]
        })
    });
    
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