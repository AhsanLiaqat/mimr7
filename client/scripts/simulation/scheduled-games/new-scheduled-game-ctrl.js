(function () {
    'use strict';

    angular.module('app')
        .controller('newScheduledGameCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'close', 'filterFilter','AccountService', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, close, filterFilter, AccountService) {

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        //fetch and set initial data
        function init() {
            $scope.page1 = true;
            $scope.playGame = {};
            $scope.gamePlan = {};
            $scope.gameMessages = [];
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            AccountService.allOrganization().then(function(response){
                $scope.organizations = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/accounts/all-organizations').then(function (response) {
            //     $scope.organizations = response.data;
            // });
        };
        init();

        //validates form values
        var validateGame = function () {
            if ($scope.page1){
                var passed  = true;
                if (!$scope.playGame.gamePlanId){
                    toastr.error('Please select a game template', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.scheduled_date){
                    toastr.error('Please select Game Schedule Date', 'Error!');
                    passed = false;
                } else if (!$scope.playGame.client){
                    toastr.error('Please select Game Client', 'Error!');
                    passed = false;
                }
                return passed;
            } else if ($scope.page2){
                var passed = true;
                angular.forEach($scope.playGame.roles, function (role) {
                    if (!role.userId){
                        toastr.error('Please select user for all roles', 'Error!');
                        passed = false;
                    }
                });
                return passed;
            } else {
                return true;
            }
        };

        //validates users
        var validatePreviousUsers = function () {
            var passed = true;
            if (!$scope.users || $scope.users.length === 0){
                passed = false;
            } else if ($scope.playGame.client.group === 'Internal Organizations' && $scope.users[0].userType === 'External'){
                passed = false;
            } else if ($scope.playGame.client.group === 'Internal Organizations' && $scope.users[0].userType === null && $scope.users[0].userAccountId !== $scope.playGame.client.id){
                passed = false;
            } else if ($scope.playGame.client.group === 'External Organizations' && $scope.users[0].userType === null){
                passed = false;
            } else if ($scope.playGame.client.group === 'External Organizations' && $scope.users[0].userType === 'External' && $scope.users[0].organizationId !== $scope.playGame.client.id){
                passed = false;
            }
            return passed;
        };

        //set values and computes roles to show on next page
        $scope.next = function () {
            if ($scope.page1 && validateGame()) {
                if ($scope.gamePlan && $scope.gamePlan.id !== $scope.playGame.gamePlanId) {
                    $http.get('/simulation/games/'+$scope.playGame.gamePlanId+'/get-roles')
                        .then(function (response) {
                            $scope.gamePlan = response.data;
                            $scope.gameMessages = $scope.gamePlan.assigned_game_messages;
                            $scope.playGame.roles = [];

                            angular.forEach($scope.gamePlan.assigned_game_messages, function (assignedMessage) {
                                angular.forEach(assignedMessage.roles, function (role) {
                                    if (!filterFilter($scope.playGame.roles, {'id': role.id})[0]){
                                        $scope.playGame.roles.push(role);
                                    }
                                });
                            });

                            $scope.page1 = false;
                            $scope.page2 = true;
                        });
                }else {
                    $scope.page1 = false;
                    $scope.page2 = true;
                }
                if (!validatePreviousUsers()){
                    $http.post('/users/getOrganizationUsers', $scope.playGame.client)
                    .then(function(response){
                        $scope.users = response.data;
                    });
                }
            } else if ($scope.page2 && validateGame()) {
                $scope.page2 = false;
                $scope.page3 = true;
            }
        };

        $scope.back = function () {
            if ($scope.page2) {
                $scope.page2 = false;
                $scope.page1 = true;
            } else {
                $scope.page3 = false;
                $scope.page2 = true;
            }
        };
        
        $scope.getUserName = function (user) {
            return user.firstName + ' ' + user.lastName;
        };

        //schedule game 
        $scope.scheduleGame = function () {
            var passed = true;
            angular.forEach($scope.gameMessages, function (gameMessage) {
                if (!gameMessage.setOffTime){
                    toastr.error('Please Set Setoff Time for all Messages', 'Error!');
                    passed = false;
                }
            });
            if (passed) {
                if ($scope.playGame.client.group === 'Internal Organizations'){
                    $scope.playGame.userAccountId = angular.copy($scope.playGame.client.id);
                } else {
                    $scope.playGame.organizationId = angular.copy($scope.playGame.client.id);
                }
                delete $scope.playGame.client;
                $http.post('/simulation/schedule-games/create', $scope.playGame)
                    .then(function(response){
                        var gamePlanTemplate = response.data;
                        var templatePlanMessages = [];
                        angular.forEach($scope.gameMessages, function(gameMessage){
                            templatePlanMessages.push({
                                setOffTime: gameMessage.setOffTime,
                                index: gameMessage.game_plan_message.index,
                                assignedGameMessageId: gameMessage.id,
                                gamePlanMessageId: gameMessage.game_plan_message.id,
                                gamePlanTemplateId: gamePlanTemplate.id
                            });
                        });
                        $http.post('/simulation/schedule-game-messages/create-batch', templatePlanMessages)
                        .then(function(response){
                            toastr.success('New Game Scheduled.', 'Success!');
                            $scope.close(gamePlanTemplate);
                        });                         
                    });
            }
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };

    }
}());