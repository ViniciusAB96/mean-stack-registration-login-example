var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var PerguntaService = require('services/pergunta.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/perguntaRegister', registrarPergunta);
router.get('/current', pegarPergunta);
router.put('/:_id', updatePergunta);
router.delete('/:_id', deletePergunta);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (response) {
            if (response) {
                // authentication successful
                res.send({ userId: response.userId, token: response.token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registrarPergunta(req, res) {
    PerguntaService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function pegarPergunta(req, res) {
    PerguntaService.getById(req.session.perguntaID)
        .then(function (pergunta) {
            if (pergunta) {
                res.send(pergunta);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatePergunta(req, res) {
    var perguntaID = req.session.perguntaID;

    PerguntaService.update(perguntaID, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePergunta(req, res) {
    var perguntaID = req.session.perguntaID;

    PerguntaService.delete(perguntaID)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}