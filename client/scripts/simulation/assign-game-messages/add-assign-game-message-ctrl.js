(function () {
    'use strict';

    angular.module('app')
        .controller('assignSimualtionAddCtrl', ['$scope',
                                                '$rootScope',
                                                'close',
                                                '$routeParams',
                                                '$http',
                                                'AuthService',
                                                'ModalService',
                                                'simMessage',
                                                '$location',
                                                '$timeout',
                                                '$filter',
                                                'Query',
                                                
                                                ctrlFunction]);

    function ctrlFunction($scope, $rootScope, close, $routeParams, $http, AuthService,
                            ModalService, simMessage, $location, $timeout, $filter, Query) {


        function assignedMsgObj() {
            this.userAccountId = $scope.user.userAccountId;
            this.gameMessageId = simMessage.id
        }

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.assignedMessage = new assignedMsgObj();
            $scope.messageRoles = [];
            if(simMessage.assigned_game_messages){
                angular.forEach(simMessage.assigned_game_messages, function(asign) {
                    angular.forEach(asign.roles, function(role) {
                      if(!$scope.messageRoles.includes(role)){
                        $scope.messageRoles.push(role);
                      }
                    });
                  });
            }
            $http.get('/simulation/game-messages/all?userAccountId='+$scope.user.userAccountId)
                .then(function (response) {
                    $scope.tasks = response.data;
                });

            $http.get('/simulation/game-roles/role-for-game?gamePlanId='+simMessage.gamePlanId)
                .then(function (response) {
                    $scope.roles = response.data;
                });
        };
        init();

        //open modal to add new role
        $scope.addRole = function (){
            ModalService.showModal({
                templateUrl: "views/simulation/game-roles/form.html",
                controller: "newGameRoleModalCtrl",
                inputs: {
                    role: null,
                    gamePlanId: null,
                    gamePlanTeamId: null,
                    sequence: true
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.roles.unshift(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //opens modal to add new message
        $scope.addMessageItem = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    message: null,
                    gamePlanId: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');

                    if (result && result !== ''){
                        $scope.tasks.unshift(result);
                    }
                });
            });
        };

        // validates form
        var validateActivity = function () {
            if (!$scope.assignedMessage.gameMessageId){
                toastr.error('Please select a message', 'Error!');
                return false;
            } else if ($scope.messageRoles.length === 0){
                toastr.error('Please select a role', 'Error!');
                return false;
            }
            return true;
        };

        // save the message
        $scope.save = function () {
            if (validateActivity()) {
                var data = {assignedMessage: $scope.assignedMessage, roles: $scope.messageRoles}
                $http.post('/simulation/game-assign-messages/create', { data: data }).then(function (response) {
                    toastr.success("Message Assigned", "Success!");
                    $scope.close(response.data);
                });
            };
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };
    }
} ());
