var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('listagemPerguntas');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/perguntas/perguntaRegister',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('listagemPerguntas', { error: 'Ocorreu um erro ao tentar salvar no banco' });
        }

        if (response.statusCode !== 200) {
            return res.render('listagemPerguntas', {
                error: response.body,
                titulo: req.body.titulo,
                subtitulo: req.body.subtitulo,
                pergunta: req.body.pergunta
                
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;