(function () {
    'use strict';

    angular.module('app')
        .controller('informationManagerGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query) {
        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.state = function(id){
            $location.path("/simulation/player-page").search({userId: id});;
        }
        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        var setSocketForGameMessages = function () {
            $timeout(function () {
                console.log('Listening ----> information_simulation_active_game:'+$scope.gameId);
                SOCKET.on('information_simulation_active_game:'+$scope.gameId, function (response) {
                    console.log('Message Recieved ----> information_simulation_active_game:'+$scope.gameId,response.data);
                    var data = response.data;
                    if(data){
                        switch (response.action) {
                            case 'update':
                                for (var i = 0; i < $scope.gameMessages.length; i++) {
                                    if ($scope.gameMessages[i].id === data.id) {
                                        $scope.gameMessages[i] = angular.copy(data);
                                        break;
                                    }
                                }
                                toastr.success('Message Updated', 'Success!');
                                break;
                            // case 1:
                            //     day = "Monday";
                            //     break;
                            
                        }
                    }else{
                        console.log('Recieved Nothing on ---> information_simulation_active_game:'+$scope.gameId);
                    }
                    $scope.$apply();
                });
            });
        }

        //fetch and set initial data
        function init() {
            $scope.playGame = {};
            $scope.gameMessages = [];
            $scope.user = Query.getCookie('user');
            $scope.gameId = $routeParams.gameId;
            console.log('+++++++++++++++++++++++++++++++++++++++',$scope.gameId);
            $http.get('/simulation/id-schedule-messages/detail-information-manager-game/' + $scope.gameId).then(function (response) {
                $scope.playGame = response.data;
                $scope.time = new Date($scope.playGame.played_At).getTime();
                // $scope.gameMessages = $scope.playGame.template_plan_messages;
                $scope.gameMessages = $scope.playGame.id_schedule_messages;
                setSocketForGameMessages();
                // $scope.gameMessages = _.sortBy($scope.playGame.message, function(o) { return  o.index });
            });
        };

        init();
        $scope.down = function(num){
            return Math.floor(num);
        }        

        //skip message and update
        $scope.skipMessage = function(gameMessage){
            $http.put('/simulation/id-schedule-messages/update/' + gameMessage.id,{skip: true,skipped_At : new Date()})
            .then(function (response) {
                
            });
        }

        // send any message
        $scope.sendMessage = function (gameMessage) {
            $http.put('/simulation/id-schedule-messages/update/' + gameMessage.id,{activated: true, activated_At: new Date()})
                .then(function (response) {

                });
        };

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            // close(params);
        };

    }
}());