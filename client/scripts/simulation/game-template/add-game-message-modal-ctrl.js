(function () {
    'use strict';

    angular.module('app')
        .controller('addGameMessagesModalCtrl', ['$scope', '$rootScope', 'close', '$routeParams','$http',
            'AuthService','$location','$timeout', '$filter', 'ModalService',
            'userAccountId', 'gamePlanId', 'filterFilter', ctrlFunction]);

    function ctrlFunction($scope, $rootScope, close, $routeParams, $http,
                          AuthService, $location, $timeout, $filter, ModalService,
                          userAccountId, gamePlanId, filterFilter) {

        //fetch and set initial data
        function init() {
            $scope.searchKeywords = '';
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];

            $scope.maxIndex = false;
            $scope.page1 = true;

            $http.get("/simulation/game-categories/all").then(function (res) {
                $scope.categories = res.data;
            });
            $http.get('/simulation/game-messages/all?userAccountId='+userAccountId)
                .then(function (response) {
                    $scope.gameMessages = response.data;
                });
            $http.get('/simulation/game-roles/all').then(function (response) {
                $scope.roles = response.data;
            });
            $http.get('/simulation/game-assign-messages/all?userAccountId=' + userAccountId)
            .then(function (response) {
                $scope.assignedMessages = response.data;
                $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');

                $http.get("/simulation/game-plan-messages/get-plan-message/" + gamePlanId)
                .then(function (response) {
                    $scope.gamePlanMessages = response.data;
                    if ($scope.gamePlanMessages.length > 0) {
                        $scope.maxIndex = _.max($scope.gamePlanMessages, function (gamePlanMessage) { return gamePlanMessage.index; });
                        var availableMessages = [];
                        angular.forEach($scope.assignedMessages, function (assignedMessage) {
                            var filteredMessage = filterFilter($scope.gamePlanMessages, {'assignedGameMessageId': assignedMessage.id});
                            filteredMessage.length === 0 ? availableMessages.push(assignedMessage) : '';
                        });

                        $scope.assignedMessages = availableMessages;
                        $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');
                    }
                    $scope.search();
                    $scope.select($scope.currentPage);
                });
            });
        };
        init();

        //do pagination
        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageMessages = $scope.filteredAssignedMessages.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredAssignedMessages = $filter('filter')($scope.assignedMessages, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredAssignedMessages = $filter('orderBy')($scope.assignedMessages, rowName);
            return $scope.onOrderChange();
        };

        //save game message
        $scope.save = function () {
            var selectedMessages = filterFilter($scope.assignedMessages, { 'selected': true });
            if (selectedMessages.length > 0) {
                var nextIndex = $scope.maxIndex ? $scope.maxIndex.index + 1 : 0;
                var gamePlanMessages = [];
                angular.forEach(selectedMessages, function (selectedMessage, index) {
                    var data = { assignedGameMessageId: selectedMessage.id, gamePlanId: gamePlanId, index: nextIndex };

                    $http.post('/simulation/game-plan-messages/save', { data: data })
                    .then(function (response) {
                        var gameMessage = {};

                        gameMessage.id = selectedMessage.id;
                        gameMessage.roles = selectedMessage.roles;
                        gameMessage.game_message = selectedMessage.game_message;
                        gameMessage.game_plan_message = {
                            id: response.data.id,
                            index: response.data.index
                        }

                        gamePlanMessages.push(gameMessage);

                        if ( (selectedMessages.length - index) === 1) {
                            toastr.success('Game Messages Assigned', 'Success!');
                            close(gamePlanMessages);
                        }
                    });
                    nextIndex = nextIndex + 1;
                });
            } else {
                toastr.error('Please select at least one assigned message', 'Error');
            }
        };

        $scope.addMessage = function () {
            $scope.page1 = false;
            $scope.page2 = true;
        };

        //add new message
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
                    if (result && result !== ''){
                        $scope.gameMessages.unshift(result);
                    }
                });
            });
        };

        //add new role
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
                });
            });
        };

        var validateAssignedMessage = function () {
            if (!$scope.assignedMessage.gameMessageId){
                toastr.error('Please select a message', 'Error!');
                return false;
            } else if ($scope.messageRoles.length === 0){
                toastr.error('Please select a role', 'Error!');
                return false;
            }
            return true;
        };

        //create assign message to game
        $scope.createAssignedMessage = function () {
            if (validateAssignedMessage()) {
                $scope.assignedMessage.userAccountId = userAccountId;
                var data = {assignedMessage: $scope.assignedMessage, roles: $scope.messageRoles}
                $http.post('/simulation/game-assign-messages/create', { data: data }).then(function (response) {
                    toastr.success("Message Assigned", "Success!");
                    $scope.assignedMessages.push(response.data);
                    $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');
                    $scope.search();
                    $scope.select($scope.currentPage);

                    $scope.page1 = true;
                    $scope.page2 = false;
                });
            };
        };

        $scope.back = function () {
            $scope.page1 = true;
            $scope.page2 = false;
        };

        //close modal
        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params; 
            close(params);
        };
    }
} ());