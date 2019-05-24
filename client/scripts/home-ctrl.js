(function () {
    'use strict';

    angular.module('app')
    .controller('homeCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query) {
        // formats date in some given format
        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('DD-MM-YYYY');
            //HH:mm
        };
        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };

        //fetch and set initial data
        function init() {
            $scope.cardsToShow = [
                {name: 'Collections',route: 'content',click: false},
                {name: 'Schedule',route: 'simulation/scheduled-games/1',click: false},
                {name: 'Active',route: 'simulation/scheduled-games/2',click: false},
                {name: 'Completed',route: 'simulation/scheduled-games/3',click: false}
            ]
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
            $http.get('/users/list2').then(function(res){
                $scope.users = res.data;
            });
            
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
                $http.get('/content-plan-templates/all')
                .then(function (response) {
                    $scope.contents = response.data;
                        if(index == 1){
                            $scope.gamesSelected = 'schedule';
                        }else if(index == 2){
                            $scope.gamesSelected = 'active';
                        }else{
                            $scope.gamesSelected = 'stop';
                        }
                        $scope.managearray();
                    });
            }
        }

        $scope.managearray = function(){
            $scope.gameToShow = []
            angular.forEach($scope.contents, function(value) {
                // value.Gname = value.game_plan.name;
                if($scope.gamesSelected == 'schedule'){
                    if(value.content_activated == false){
                        $scope.gameToShow.push(value);
                    }
                }else if($scope.gamesSelected == 'active'){
                    if(value.content_activated == true && value.status != 'stop'){
                        $scope.gameToShow.push(value);
                    }
                }
                else{
                    if(value.status == 'stop'){
                        $scope.gameToShow.push(value);
                    }
                }
            });
            // $scope.gameToShow = $filter('orderBy')($scope.gameToShow, 'Gname');
        }

        $scope.scheduleContent = function (game) {
            ModalService.showModal({
                templateUrl: "views/schedule-content/content-library.html",
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

        $scope.editScheduleContent = function (contentId) {
            ModalService.showModal({
                templateUrl: "views/schedule-content/edit-content-library.html",
                controller: "editContentLibraryCtrl",
                inputs: {
                    gameId: contentId
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
                templateUrl: "views/content/new-content-making.html",
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
                templateUrl: "views/content/new-content-making.html",
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
                toastr.success('Content Template Deleted.', 'Success!');
            });
        };

        // $scope.deleteScheduleContent = function (card, index) {
        //     $http.delete('/content-plan-templates/remove/' + card.id)
        //     .then(function(res){
        //         $scope.gameToShow.splice(index,1);
        //         toastr.success('Content Template Deleted.', 'Success!');
        //     });
        // };

        $scope.deleteScheduleContent = function (card, index) { // tick
            ModalService.showModal({
                templateUrl: "views/content/delete-confirmation-popup.html",
                controller: "removeContentCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result != undefined && result.answer === '87654321'){
                        $http.delete('/content-plan-templates/remove/' + card.id)
                        .then(function(res){
                            $scope.gameToShow.splice(index,1);
                            toastr.success('Content Template Deleted.', 'Success!');
                        });
                    }else{
                        toastr.error('Content not deleted, Try again!');
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });

        }

        $scope.sendQuestions = function(game){
            $http.get('/content-plan-templates/get/'+game.id).then(function(response) {
                $scope.data = response.data;
            });
            $http.post('/content-plan-templates/update/'+game.id, {content_activated: true,play_date: new Date(),start_time : new Date()})
            .then(function(response){
                angular.forEach($scope.data.question_schedulings, function(question) {
                    var dataMessage = {setOffTime : new Date()};
                    $http.post('/question-scheduling/update-message-off-set/'+question.id,{data:dataMessage}).then(function(res){
                        $http.get('/content-plan-templates/all')
                        .then(function (response) {
                            $scope.contents = response.data;
                            $scope.gamesSelected = 'schedule';
                            $scope.managearray();
                        });
                    });
                });
            });
        }

    }
}());
