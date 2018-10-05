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
            $scope.cards = [
                {name: 'Game Library',route: 'game-template',click: false},
                {name: 'Scheduled Games',route: 'simulation/scheduled-games/1',click: false},
                {name: 'Active Games',route: 'simulation/scheduled-games/2',click: false},
                {name: 'Completed Games',route: 'simulation/scheduled-games/3',click: false}
            ]
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
            $http.get('/article/articles/all')
            .then(function(res){
                $scope.cards = res.data;
            });
        }
        init();

        //fetch and set data on down card
        $scope.showGraph = function(index,card){
            if(!card.click){
                angular.forEach($scope.cards, function (card) {
                    card.click = false;
                });
            }
            card.click = !card.click;
            $scope.card = card;
            $scope.card.index = index;
            // card for game library
            if(index == 0 && card.click == true){
                $http.get('/simulation/games/all').then(function (response) {
                    $scope.gameTemplates = response.data;
                    angular.forEach($scope.gameTemplates, function(game) {
                        game.type = 0;
                    });
                    $http.get('/simulation/id-games/all').then(function (response) {
                        $scope.ID_games = response.data;
                        angular.forEach($scope.ID_games, function(game) {
                            game.type = 1;
                            $scope.gameTemplates.push(game);
                        });
                        $scope.gameTemplates = $filter('orderBy')($scope.gameTemplates, 'name');
                        // $scope.gameTemplates += $scope.ID_games;
                    });
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

        // manage array for both type games filtered by cards used
        $scope.managearray = function(){
            $scope.gameToShow = []
            angular.forEach($scope.games, function(value) {
                value.type = 0;
                value.Gname = value.game_plan.name;
                if($scope.gamesSelected == 'schedule'){
                    if(value.plan_activated == false){
                        $scope.gameToShow.push(value);
                    }
                }else if($scope.gamesSelected == 'active'){
                    if(value.plan_activated == true && value.status != 'stop'){
                        $scope.gameToShow.push(value);
                    }
                }
                else{
                    if(value.status == 'stop'){
                        $scope.gameToShow.push(value);
                    }
                }
            });
            angular.forEach($scope.id_schedule_games, function(value) {
                value.type = 1;
                value.Gname = value.id_game.name;
                if($scope.gamesSelected == 'schedule'){
                    if(value.activated == false){
                        $scope.gameToShow.push(value);
                    }
                }else if($scope.gamesSelected == 'active'){
                    if(value.activated == true ){
                        $scope.gameToShow.push(value);
                    }
                }
                else{
                    // if(value.status == 'stop'){
                    //   $scope.gameToShow.push(value);
                    // }
                }
            });
            $scope.gameToShow = $filter('orderBy')($scope.gameToShow, 'Gname');
        }

        /////////////////////methods or functions used in game library cards////////////////////////////

        //open modal to create new game
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

        //open modal to schedule game
        $scope.scheduleGame = function (game) {
            if(game.type == 0){
                ModalService.showModal({
                    templateUrl: "views/simulation/scheduled-games/add-modal-second.html",
                    controller: "secondScheduledGameCtrl",
                    inputs: {
                        gameId: game.id
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result && result !== '') {
                            $scope.scheduleRound(result);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/id-games/schedule-id-game.html",
                    controller: "scheduledIDGameCtrl",
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
            }
        };

        //opens modal to edit game from game library
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
            $http.delete('/article/articles/remove/' + card.id)
            .then(function(res){
                $scope.cards.splice(index,1);
                toastr.success('Game Template Deleted.', 'Success!');
            });
        };

        // open modal to play ID game direct
        $scope.playIDGame = function(game){
            ModalService.showModal({
                templateUrl: "views/simulation/id-games/play-id-game.html",
                controller: "playIDGameCtrl",
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
        }

        /////////////////////methods or functions used in other 3 cards for scheduled/active/closed games///////////////////////////

        //schedule rounds for given simulation simple type game
        $scope.scheduleRound = function (Id) {
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/round-schedule.html",
                controller: "roundScheduleCtrl",
                inputs: {
                    gameId: Id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // opens modal to play a scheduled game ( both games )
        $scope.playGame = function (game) {
            if(game.type == 0){
                $http.post('/simulation/schedule-games/update/'+game.id, {plan_activated: true,play_date: new Date()})
                .then(function(response){
                    $http.get('/simulation/schedule-games/all')
                    .then(function (response) {
                        $scope.games = response.data;
                        $http.get('/simulation/id-schedule-games/all')
                        .then(function (resp) {
                            $scope.id_schedule_games = resp.data;
                            $scope.gamesSelected = 'schedule';
                            $scope.managearray();
                        })
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/id-scheduled-games/play-id-schedule-game-modal.html",
                    controller: "playScheduledIDGameCtrl",
                    inputs: { gameId: game.id }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $http.get('/simulation/schedule-games/all')
                        .then(function (response) {
                            $scope.games = response.data;
                            $http.get('/simulation/id-schedule-games/all')
                            .then(function (resp) {
                                $scope.id_schedule_games = resp.data;
                                $scope.gamesSelected = 'schedule';
                                $scope.managearray();
                            })
                        });
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
        };

        //Play training game
        $scope.playTrainingGame = function(game){
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/play-training-game.html",
                controller: "playTrainingGameCtrl",
                inputs: {
                    gameId: game.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $http.get('/simulation/schedule-games/all')
                        .then(function (response) {
                            $scope.games = response.data;
                            $http.get('/simulation/id-schedule-games/all')
                            .then(function (resp) {
                                $scope.id_schedule_games = resp.data;
                                $scope.gamesSelected = 'schedule';
                                $scope.managearray();
                            })
                        });
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        // open modal to generate emails for active games
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

        //opens modal to edit game
        $scope.editGame = function (gameId, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/edit-modal.html",
                controller: "editScheduledGameCtrl",
                inputs: { gameId: gameId }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.gameToShow[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // delete game from scheduled/active/closed games (both games)
        $scope.deleteGame = function (game, index) {
            if(game.type == 0 ){
                $http.delete("/simulation/schedule-games/remove/" + game.id)
                .then(function(res){
                    $scope.gameToShow.splice(index,1);
                    toastr.success('Game deleted.', 'Success!');
                });
            }else{
                $http.delete("/simulation/id-schedule-games/remove/" + game.id)
                .then(function(res){
                    $scope.gameToShow.splice(index,1);
                    toastr.success('ID Game deleted.', 'Success!');
                });
            }
        };
    }
}());
