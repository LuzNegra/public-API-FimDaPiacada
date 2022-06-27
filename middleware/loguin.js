const req = require('express/lib/request');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, "ChaveFimDaPicada");
        req.orgao = decode;
        next();
    } catch (error) {
        return  res.status(401).send({ message: "Falha na autenticação"})
    }
}