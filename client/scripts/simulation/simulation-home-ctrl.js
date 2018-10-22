(function () {
    'use strict';

    angular.module('app')
    .controller('simulationHomeCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query) {
        // formats date in some given format
        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            //HH:mm
        };
        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };

        //fetch and set initial data
        function init() {
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
            $http.get('/articles/all')
            .then(function(res){
                $scope.cards = res.data;
            });
        }
        init();

        // manage array for both type games filtered by cards used
        $scope.newContent = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/new-game-template-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.cards.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editModal = function (id, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/new-game-template-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.cards[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // deletes game from game library
        $scope.delete = function (index, card) {
            $http.delete('/articles/remove/' + card.id)
            .then(function(res){
                $scope.cards.splice(index,1);
                toastr.success('Game Template Deleted.', 'Success!');
            });
        };

        $scope.GenerateEmail = function (Id) {
            ModalService.showModal({
                templateUrl: "views/simulation/active-games/generate-emails-active-games.html",
                controller: "generateEmailsActiveGamesCtrl",
                inputs: {
                    gameId: Id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

    }
}());
