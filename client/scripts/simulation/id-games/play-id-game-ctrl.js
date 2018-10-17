(function () {
    'use strict';

    angular.module('app')
        .controller('playIDGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','MessageService','IncidentService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, MessageService, IncidentService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // initial data fetch
        function init() {

            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.playGame = { idGameId: gameId, scheduled_date: new Date()};

            $http.get('/simulation/id-games/all').then(function (response) {
                $scope.gameTemplates = response.data;
                $scope.gameTemplates = $filter('orderBy')($scope.gameTemplates, 'name');
            });
            $http.get('/simulation/id-games/get/'+gameId).then(function(response) {
                $scope.data = response.data;
                $scope.id_messages = response.data.id_messages;
                $scope.id_messages = $filter('orderBy')($scope.id_messages, 'order');
            });
            IncidentService.all($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
            
        };
        init();

        // front end validations 
        var validateGame = function () {
            var passed  = true;
            if (!$scope.playGame.idGameId){
                toastr.error('Please select a game template', 'Error!');
                passed = false;
            } else if (!$scope.playGame.scheduled_date){
                toastr.error('Please select Game Schedule Date', 'Error!');
                passed = false;
            } 
            else if($scope.id_messages.length == 0){
                toastr.error('You have no messages assigned to this Game.', 'Error!');
                passed = false;
            }
            else {
                passed = true;
            }
            return passed;
        };

        // open modal to create new incident
        $scope.addIncident = function () {
            ModalService.showModal({
                templateUrl: "views/home/add-incident-modal.html",
                controller: "addIncidentModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (response) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(response && response !== ''){
                        $scope.incidents.unshift(response);
                    }
                });
            });
        };
        // creates active ID game with scheduled messages
        $scope.submit = function () {
            if (validateGame()) {
                $http.post('/simulation/id-schedule-games/create',{data: $scope.playGame}).then(function(res){
                    $scope.Game = res.data;
                    angular.forEach($scope.id_messages, function(msg,ind){
                        var data = {
                            idScheduleGameId: $scope.Game.id,
                            message: msg.message,
                            setOffTime: new Date(),
                            order: msg.order,
                            idMessageId: msg.id,
                            userId: $scope.user.id,
                            activated: true,
                            activated_At: new Date()
                        }
                        $http.post('/simulation/id-schedule-messages/create/',{data: data}).then(function(res){
                            if(ind == $scope.id_messages.length - 1){
                                $http.get('/simulation/id-schedule-games/get/'+$scope.Game.id).then(function(response) {
                                    $scope.game = response.data;
                                    $scope.id_messages = $scope.game.id_schedule_messages;
                                    $scope.game.incidentId = $scope.incidentId;
                                    $scope.game.activated = true;
                                    $scope.game.played_At = new Date();
                                    angular.forEach($scope.id_messages, function(msg) {
                                        var txt = {
                                            userId: msg.userId,
                                            message: msg.message,
                                            status: 'Incoming',
                                            incidentId: $scope.incidentId
                                        };
                                        MessageService.save(txt).then(function(response){

                                        },function(err){
                                            if(err)
                                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                            else
                                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                        });
                                        // $http.post('/messages/save/',{data: txt}).then(function(response) {
                                        // });
                                    });
                                    $http.put('/simulation/id-schedule-games/update/'+$scope.game.id,{data: $scope.game}).then(function(response) {
                                        $scope.game = response.data;
                                        close();
                                    });
                                });
                            }
                        });
                    });
                });
            }       
        };

        // close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());