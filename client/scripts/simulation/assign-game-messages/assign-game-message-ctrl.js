(function () {
    'use strict';
    angular.module('app')
        .controller('assignSimulationListCtrl', ['$scope', '$http', 'Query', '$filter', '$route', 'ModalService', assignSimulationListCtrl]);
        function assignSimulationListCtrl($scope, $http, Query, $filter, $route, ModalService) {

            //fetch and set initial data
            $scope.init = function() {
                $scope.assignedMessage = false;
                $scope.unassignedMessages = true;
                $scope.items = [{name: '10 items per page', val: 10},
                    {name: '20 items per page', val: 20},
                    {name: '30 items per page', val: 30},
                    {name: 'show all items', val: 30000}];
                $scope.pageItems = 10;
                $scope.user = Query.getCookie('user');
            }
            $scope.init();

            //function associated with table to fetch data
            $scope.assignedTable = function (tableState) {
                $scope.tableState = tableState;
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;

                $http.get('/simulation/game-assign-messages/all?userAccountId='+$scope.user.userAccountId)
                    .then(function(response) {
                        $scope.assignedMessages = response.data;
                        $scope.safeAssignedMessages = angular.copy($scope.assignedMessages);
                        $scope.total = response.data.length;
                        $scope.sortByCreate = _.sortBy($scope.assignedMessages, function (o) { return o.name; });
                        $scope.a = $scope.sortByCreate.reverse();
                        var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                        if (tableState.sort.predicate) {
                            filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                        }
                        var result = filtered.slice(start, start + number);
                        $scope.assignedMessages = result;
                        tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                        $scope.isLoading = false;
                    });
            };

            //function associated with table to fetch data
            $scope.NottasksTable = function (tableState) {
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;

                $http.get("/simulation/game-messages/un-assigned-all?accountId=" + $scope.user.userAccountId)
                    .then(function(response) {
                        $scope.a = $scope.notAssigned = response.data;
                        $scope.safeNotAssigned = angular.copy($scope.notAssigned);
                        $scope.total = $scope.notAssigned.length;
                        var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                        if (tableState.sort.predicate) {
                            filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                        }

                        var result = filtered.slice(start, start + number);

                        $scope.notAssigned = result;

                        tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                        $scope.isLoading = false;
                    });
            };

            //control flow
            $scope.assigned = function(){
                $scope.assignedMessage = true;
                $scope.unassignedMessages = false;
            };

            $scope.unAssigned = function(){
                $scope.assignedMessage = false;
                $scope.unassignedMessages = true;
            };

            //add new message unassigned
            $scope.newSimulationMessage = function() {
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
                            $scope.notAssigned.unshift(result);
                        }
                    });
                });
            };

            //edit message unassigned
            $scope.editSimMessage = function(message, index) {
                ModalService.showModal({
                    templateUrl: "views/simulation/game-messages/form.html",
                    controller: "messageCreateCtrl",
                    inputs:{
                        message: message,
                        gamePlanId: null
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');

                        if (result && result !== ''){
                            $scope.notAssigned[index] = result;
                        }
                    });
                });
            };

            // delete message unassigned
            $scope.deleteSimMessage = function (id, index) {
                $http.delete("/simulation/game-messages/remove/" + id)
                    .then(function(res){
                        $scope.notAssigned.splice(index, 1);
                        toastr.success('Message deleted.', 'Success!');
                    });
            };

            //assigning unassigned message
            $scope.assignNewSimMessage = function (simMessageId) {
                ModalService.showModal({
                    templateUrl: "views/simulation/assign-game-messages/form.html",
                    controller: "assignSimualtionAddCtrl",
                    inputs: {
                        simMessageId: simMessageId
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if(result && result !== ''){
                            $scope.assignedMessages.unshift(result);
                            angular.forEach($scope.notAssigned, function (simMessage, index) {
                                if (simMessage.id === result.gameMessageId) {
                                    $scope.notAssigned.splice(index, 1);
                                }
                            })
                        }
                    });
                });
            };

            //edit assigned message
            $scope.editAssignedMessage = function (message, index) {
                ModalService.showModal({
                    templateUrl: "views/simulation/assign-game-messages/form.html",
                    controller: "assignSimualtionEditCtrl",
                    inputs: {
                        assignedMessage: message
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if(result && result !== ''){
                            $scope.assignedMessages[index] = result;
                        }
                    });
                });
            };

            // delete assigned message
            $scope.deleteActivityWizard = function (activityId,index) {
                $http.delete('/simulation/game-assign-messages/remove?id='+activityId)
                    .then(function(response) {
                        toastr.success("Activity deleted successfully");
                        $scope.assignedMessages.splice(index,1);
                    });
            };
    };

})(); 