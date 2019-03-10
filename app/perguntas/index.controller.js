(function () {
    'use strict';

    angular
        .module('app')
        .controller('Perguntas.IndexController', Controller);

    function Controller($window, PerguntaService, FlashService) {
        var perg = this;

        perg.pergunta = null;
        perg.savePergunta = savePergunta;
        perg.deletePergunta = deletePergunta;
        perg.UpdatePergunta = UpdatePergunta;

        initController();

        function initController() {
            // get current user
            PerguntaService.GetCurrent().then(function (pergunta) {
                perg.pergunta = pergunta;
            });
        }

        function UpdatePergunta() {
            PerguntaService.Update(perg.pergunta)
                .then(function () {
                    FlashService.Success('Pergunta Atualizda');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        function savePergunta(){
            PerguntaService.Save(perg).then(() => {
                FlashService.Success('Pergunta Atualizda');
            }).catch((error) => {
                FlashService.Error(error);
            });
        }

        function deletePergunta() {
            PerguntaService.Delete(perg.pergunta._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();