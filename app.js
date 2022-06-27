const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({
      success: true
    })
})

app.get('/procurar', (req, res) => {
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