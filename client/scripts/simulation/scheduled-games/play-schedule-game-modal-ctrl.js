(function () {
    'use strict';

    angular.module('app')
        .controller('playScheduledGameModalCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter', 'gameId', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter, gameId) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };

        //get and fetch initial data
        function init() {
            $scope.playGame = {};
            $scope.gameMessages = [];
            $http.get('/simulation/schedule-games/play-game-summary/' + gameId).then(function (response) {
                $scope.playGame = response.data;
            });
        };
        init();

        //send message
        $scope.sendMessage = function (gameMessage) {
            var roleUsers = [];
            angular.forEach(gameMessage.assigned_game_message.roles, function (role) {
                var filteredRole = angular.copy(filterFilter($scope.playGame.roles, {'id': role.id})[0]);
                delete filteredRole.user;
                roleUsers.push(filteredRole);
            });
            $http.post('/simulation/schedule-game-messages/send-message/' + gameMessage.id, roleUsers)
                .then(function (response) {
                    gameMessage.activated = true;
                    gameMessage.activatedAt = new Date();
                    toastr.success('Message Sent', 'Success!');
                });
        };

        //send all messages
        $scope.sendAllMessages = function () {
            angular.forEach($scope.gameMessages, function (gameMessage) {
                if (!gameMessage.setOffTime){
                    toastr.error('Please Set Setoff Time for all Messages', 'Error!');
                    passed = false;
                }
            });
            if ($scope.playGame.client.group === 'Internal Organizations') {
                $scope.playGame.userAccountId = angular.copy($scope.playGame.client.id);
            } else {
                $scope.playGame.organizationId = angular.copy($scope.playGame.client.id);
            }
            delete $scope.playGame.client;
            $http.post('/simulation/schedule-games/update/'+$scope.playGame.id, $scope.playGame)
                .then(function(response){
                    var gamePlanTemplate = response.data;
                    $scope.close(gamePlanTemplate);
                });
        };

        $scope.getUserName = function (roleId) {
            var filteredRole =  filterFilter($scope.playGame.roles, {'id': roleId})[0];
            return filteredRole.user.firstName + ' ' + filteredRole.user.lastName;
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined) ? '' : params; 
            close(params);
        };

    }
}());