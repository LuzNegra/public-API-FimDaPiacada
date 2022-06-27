const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const rotaEndereco = require('./routes/endereco');
const rotaDenuncia = require('./routes/denuncia');
const rotaLoguin = require('./routes/loguin_orgao');
const rotaOrgao = require('./routes/orgao');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/endereco', rotaEndereco);
app.use('/denuncia', rotaDenuncia);
app.use('/loguin', rotaLoguin);
app.use('/orgao', rotaOrgao);

app.get('/', (req, res) => {
    res.status(200).json({
      success: true
    })
})

app.use((req, res, next) => {
    const erro = new Error('URL Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem : error.message
        }
    })
})
module.exports = app;