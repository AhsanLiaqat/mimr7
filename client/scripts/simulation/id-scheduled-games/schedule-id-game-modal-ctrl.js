(function () {
    'use strict';

    angular.module('app')
        .controller('playScheduledIDGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query','IncidentService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query, IncidentService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        // fetch and set initial data
        function init() {
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
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
            $http.get('/simulation/id-schedule-games/get/'+gameId).then(function(response) {
                $scope.game = response.data;
                $scope.messages = $scope.game.id_schedule_messages;
            });
        };
        init();

        //open modal to create incident
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
        
        //save schedule id game
        $scope.submit = function () {
            $scope.game.activated = true;
            $scope.game.played_At = new Date();
            angular.forEach($scope.messages, function(msg) {
                msg.setOffTime = new Date();
                msg.setOffTime.setMinutes ( msg.setOffTime.getMinutes() + msg.offset );
                $http.put('/simulation/id-schedule-messages/update/'+msg.id,msg).then(function(response) {
                });
            });
            $http.put('/simulation/id-schedule-games/update/'+gameId,{data: $scope.game}).then(function(response) {
                $scope.game = response.data;
                close();
            });
        };

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());