(function () {
    'use strict';

    angular.module('app')
        .controller('playTrainingGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','IncidentService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, IncidentService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // initial data fetch
        function init() {
            $scope.selection = 'withoutIncident';
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.playGame = {id: gameId, play_date: new Date()};
            $http.get('/simulation/schedule-games/get/'+gameId).then(function(response) {
                $scope.data = response.data;
                $scope.gameId = $scope.data.gamePlanId;
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
            if (!$scope.playGame.incidentId){
                toastr.error('Please select an Incident.', 'Error!');
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
            if($scope.selection == 'withIncident'){
                $scope.playGame.plan_activated = true;
                if (validateGame()) {
                    $http.post('/simulation/schedule-games/update/'+$scope.playGame.id,$scope.playGame).then(function(res){
                        $scope.Game = res.data;
                        $scope.close(res.data);
                    });
                }       
            }else{
                $http.post('/simulation/schedule-games/update/'+$scope.playGame.id, {plan_activated: true,play_date: new Date()})
                .then(function(response){
                    angular.forEach($scope.data.template_plan_messages, function(msg) {
                        if(msg.offset == 0){
                            var dataMessage = {setOffTime : new Date()};
                            $http.post('/simulation/schedule-game-messages/update-message-off-set/'+msg.id,{data:dataMessage}).then(function(res){
                            });
                        }
                    });
                    $scope.close('withoutIncident');
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