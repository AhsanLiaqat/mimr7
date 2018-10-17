(function () {
    'use strict';

    angular.module('app')
        .controller('newGameTemplateModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','Query', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter,Query) {

        //fetch and set initial data
        function init() {
            $scope.searchKeywords = '';
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];

            $scope.page1 = true;
            $scope.action = [];
            $scope.typeOptions = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.user = Query.getCookie('user');

            $http.get("/simulation/game-categories/all").then(function (res) {
                $scope.categories = res.data;
            });

            $scope.data = {};
            var date = $filter('date')(new Date('1/1/2017'), 'dd/MM/yyyy');
            $scope.data.planDate = date;

            $http.get('/simulation/game-messages/all?userAccountId='+$scope.user.userAccountId)
                .then(function (response) {
                    $scope.gameMessages = response.data;
                });

            $http.get('/simulation/game-roles/all').then(function (response) {
                $scope.roles = response.data;
            });

            $http.get('/simulation/game-assign-messages/all?userAccountId=' + $scope.user.userAccountId)
            .then(function (response) {
                $scope.assignedMessages = response.data;
                $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');

                $scope.search();
                $scope.select($scope.currentPage);
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

        //open modal to create new game type
        $scope.addGameCategory = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/categories/form.html",
                controller: "newGameCategoryCtrl",
                inputs:{
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result && result !== ''){
                        $scope.categories.push(result);
                    }
                });
            });
        };

        //save game template 
        $scope.save = function (data) {
            if ($scope.data.name != null && data.planDate != null) {
                data.planDate = moment.utc(data.planDate, 'DD/MM/YYYY', true).format();
                $http.post('/simulation/games/save', { data: data }).then(function (response) {
                    $scope.data = response.data;
                });
                $scope.page1 = false;
                $scope.page3 = true;
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };


        $scope.closePicker = function () {
            $('.datepicker').hide();
        };

        $scope.saveExit = function () {
            close($scope.data);
        };

        //control flow
        $scope.backToAssignedMessages = function () {
            $scope.page3 = true;
            $scope.page4 = false;
        };

        function assignedMsgObj() {
            this.userAccountId = $scope.user.userAccountId;
        }

        $scope.newAssignedMessage = function () {
            $scope.assignedMessage = new assignedMsgObj();
            $scope.messageRoles = [];
            $scope.page3 = false;
            $scope.page4 = true;
        };

        //open modal top create message
        $scope.addMessageItem = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    message: null,
                    gamePlanId: $scope.data.id
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

        //open modal top create role
        $scope.addRole = function (){
            ModalService.showModal({
                templateUrl: "views/simulation/game-roles/form.html",
                controller: "newGameRoleModalCtrl",
                inputs: {
                    role: null,
                    gamePlanId: $scope.data.id,
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

        //save game messages and other 
        $scope.saveGameTemplate = function () {
            var selectedMessages = filterFilter($scope.assignedMessages, { 'selected': true });
            if (selectedMessages.length > 0) {
                var nextIndex = 0;
                angular.forEach(selectedMessages, function (assignedMessage, index) {
                    var data = { assignedGameMessageId: assignedMessage.id, gamePlanId: $scope.data.id, index: nextIndex };
                    $http.post('/simulation/game-plan-messages/save', { data: data })
                        .then(function (response) {
                            if (selectedMessages.length - index === 1) {
                                toastr.success('Game Template Created', 'Success!');
                                close($scope.data);
                            }
                        });
                    nextIndex = nextIndex + 1;
                });
            } else {
                toastr.error('Please select at least one message', 'Error');
            }
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

        //assign message to game
        $scope.createAssignedMessage = function () {
            if (validateAssignedMessage()) {
                var data = {assignedMessage: $scope.assignedMessage, roles: $scope.messageRoles}
                $http.post('/simulation/game-assign-messages/create', { data: data }).then(function (response) {
                    toastr.success("Message Assigned", "Success!");
                    $scope.assignedMessages.push(response.data);
                    $scope.assignedMessages = $filter('orderBy')($scope.assignedMessages, 'game_message.name');
                    $scope.search();
                    $scope.select($scope.currentPage);

                    $scope.page3 = true;
                    $scope.page4 = false;
                });
            };
        };

    }
}());