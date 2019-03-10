var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('perguntas');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.perguntas.findById(_id, function (err, pergunta) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (pergunta) {
            // retorna a pergunta
            deferred.resolve(pergunta);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(perguntasParam) {
    var deferred = Q.defer();

    // validation
    db.perguntas.findOne(
        { _id: perguntasParam._id },
        function (err, pergunta) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (pergunta) {
                //pergunta já existe
                deferred.reject('Pergunta "' + perguntasParam.titulo + '" já existe');
            } else {
                createPerguntas();
            }
        });

    function createPerguntas() {

        db.perguntas.insert(
            pergunta,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, perguntasParam) {
    var deferred = Q.defer();

    // validation
    db.perguntas.findById(_id, function (err, pergunta) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (pergunta.titulo !== perguntasParam.titulo) {
            // O título da pergunta mudou verificar se o mesmo já existe.
            db.perguntas.findOne(
                { titulo: perguntasParam.titulo },
                function (err, pergunta) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (pergunta) {
                        // username already exists
                        deferred.reject('Título já existe:  "' + req.body.titulo)
                    } else {
                        updatePergunta();
                    }
                });
        } else {
            updatePergunta();
        }
    });

    function updatePergunta() {
        // fields to update
        var set = {
            titulo: userParam.titulo,
            corpoPergunta: userParam.corpoPergunta,
            Data: Date.now()
        };

        db.perguntas.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.perguntas.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}