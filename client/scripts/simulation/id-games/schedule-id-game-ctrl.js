(function () {
    'use strict';

    angular.module('app')
        .controller('scheduledIDGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','gameId','$timeout','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter,gameId,$timeout,Query) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        
        // initial data fetch
        function init() {
            $scope.newDate = new Date().toDateString();
            $scope.user = Query.getCookie('user');
            $scope.page1 = true;
            $scope.playGame = {};

            $scope.playGame.idGameId=gameId;
            $http.get('/simulation/id-games/all').then(function (response) {
                $scope.gameTemplates = response.data;
                $scope.gameTemplates = $filter('orderBy')($scope.gameTemplates, 'name');
            });
            $http.get('/simulation/id-games/get/'+gameId).then(function(response) {
                $scope.data = response.data;
                $scope.messages = response.data.id_messages;
                $scope.messages = $filter('orderBy')($scope.messages, 'order');
            });
        };
        init();

        // check front end validations
        var validateGame = function () {
            if ($scope.page1){
                var passed  = true;
                if (!$scope.playGame.idGameId){
                    toastr.error('Please select a game template', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.scheduled_date){
                    toastr.error('Please select Game Schedule Date', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.time){
                    toastr.error('Please select Time.', 'Error!');
                    passed = false;
                }else if($scope.messages.length == 0){
                    toastr.error('You have no messages assigned to this Game.', 'Error!');
                    passed = false;
                }
                return passed;
            } else if ($scope.page2){
                var passed = true;
                angular.forEach($scope.messages, function (msg) {
                    if (msg.offset < 0){
                        toastr.error('Please set message offset', 'Error!');
                        passed = false;
                    }
                });
                return passed;
            } else {
                return true;
            }
        };
        // on calculation of message offset for next page view
        $scope.next = function () {
            if ($scope.page1 && validateGame()) {
                $http.post('/simulation/id-schedule-games/create',{data: $scope.playGame}).then(function(res){
                    $scope.playGame = res.data;
                });
                if($scope.messages.length != 0 ){
                    var interval = ( $scope.playGame.time / $scope.messages.length ) * 60 ;
                }else{
                    var interval = ( $scope.playGame.time ) * 60 ;
                }
                var seconds = interval;
                angular.forEach($scope.messages, function(msg,ind){
                    if ( ind == 0 ){
                        seconds = ( interval / 2 );
                    }
                    else{
                        seconds += interval;
                    }
                    msg.offset = angular.copy(seconds);
                    msg.offset = msg.offset / 60;
                });
                $scope.page1 = false;
                $scope.page2 = true; 
            }
        };

        //final save message with respective offsets
        $scope.scheduleGame = function () {
            console.log('----------------------------------------------------------',$scope.user);
          if($scope.messages.length==0){
            toastr.error("No More Messages");
            close();
          }  
          else{
            angular.forEach($scope.messages, function(msg,ind){
                var data = {
                    idScheduleGameId: $scope.playGame.id,
                    message: msg.message,
                    offset: msg.offset,
                    order: msg.order,
                    idMessageId: msg.id,
                    userId: $scope.user.id
                }
                $http.post('/simulation/id-schedule-messages/create',{data: data}).then(function(res){
                    if(ind == $scope.messages.length - 1){
                        close($scope.playGame);
                    }
                });
            });
          }
        };

        //close modal 
        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());