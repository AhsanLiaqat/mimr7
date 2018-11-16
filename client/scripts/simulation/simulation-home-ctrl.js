(function () {
    'use strict';

    angular.module('app')
    .controller('homeCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query', homeFunction]);

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
            $scope.cardsToShow = [
                {name: 'Content Library',route: 'game-template',click: false},
                {name: 'Scheduled Content',route: 'simulation/scheduled-games/1',click: false},
                {name: 'Active Content',route: 'simulation/scheduled-games/2',click: false},
                {name: 'Completed',route: 'simulation/scheduled-games/3',click: false}
            ]
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
            
        }
        init();

         $scope.showContents = function(index,card){
            if(!card.click){
                angular.forEach($scope.cardsToShow, function (card) {
                    card.click = false;
                });
            }
            card.click = !card.click;
            $scope.card = card;
            $scope.card.index = index;
            if(index == 0 && card.click == true){
                $http.get('/articles/all').then(function(res){
                    $scope.cards = res.data;
                });
            }else if( card.click == true){
                // card of other 3 game types
                $http.get('/simulation/schedule-games/all')
                .then(function (response) {
                    $scope.games = response.data;
                    $http.get('/simulation/id-schedule-games/all')
                    .then(function (resp) {
                        $scope.id_schedule_games = resp.data;
                        if(index == 1){
                            $scope.gamesSelected = 'schedule';
                        }else if(index == 2){
                            $scope.gamesSelected = 'active';
                        }else{
                            $scope.gamesSelected = 'stop';
                        }
                        $scope.managearray();
                    });
                });
            }
        }

        $scope.scheduleGame = function (game) {
            ModalService.showModal({
                templateUrl: "views/simulation/schedule-content/content-library.html",
                controller: "contentLibraryCtrl",
                inputs: {
                    gameId: game.id
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
