(function () {
    'use strict';

    angular.module('app')
        .controller('assignSimualtionEditCtrl', ['$scope',
            '$rootScope',
            'close',
            '$routeParams',
            '$http',
            'AuthService',
            'ModalService',
            'assignedMessage',
            '$location',
            '$timeout',
            '$filter',
            'Query',
            ctrlFunction]);

    function ctrlFunction($scope, $rootScope, close, $routeParams, $http, AuthService, ModalService,
                            assignedMessage, $location, $timeout, $filter, Query) {

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.assignedMessage = angular.copy(assignedMessage);
            $scope.assignedMessage.gameMessageId = $scope.assignedMessage.id
            $scope.messageRoles = [];
            angular.forEach($scope.assignedMessage.roles, function (role) {
                $scope.messageRoles.push(role.id);
            });
            $http.get('/simulation/game-messages/all?userAccountId='+$scope.user.userAccountId)
            .then(function (response) {
                $scope.tasks = response.data;
            });
            $http.get('/simulation/game-roles/all')
            .then(function (response) {
                $scope.roles = response.data;
            });
        };
        init();

        //open modal to add role
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

        //open modal to add new message
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

        //validates form
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

        //update edited message
        $scope.save = function () {
            if (validateActivity()) {
                var data = {assignedMessage: $scope.assignedMessage, roles: $scope.messageRoles}
                $http.post('/simulation/game-assign-messages/update', { data: data })
                .then(function (response) {
                    toastr.success("Message Updated", "Success!");
                    $scope.close(response.data);
                });
            };
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };
    }
}());