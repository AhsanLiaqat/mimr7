(function () {
    'use strict';

    angular.module('app')
    .controller('simulationMessageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {

        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;

        //method associated with table to fetch and set data
        $scope.messagesTable = function (tableState) {
            $scope.selectoptions = [];
            $scope.messageToShow = []
            $scope.selectoptions.push({id: 0,name: 'All Game Templates'});
            $scope.isLoading = true;
            $scope.tableState = tableState;

            $scope.user = Query.getCookie('user');
            var path = "/simulation/game-messages/all?accountId=" + $scope.user.userAccountId;

            $http.get(path).then(function(response) {
                $http.get('/simulation/games/all').then(function (resp) {
                    $scope.gameTemplates = resp.data;
                    angular.forEach($scope.gameTemplates, function(value) {
                      $scope.selectoptions.push(value);
                    });
                    $scope.messages = response.data;
                    $scope.messages = _.sortBy($scope.messages, function (o) { return new Date(o.order); });
                    $scope.safeMessages = angular.copy($scope.messages);
                    $scope.isLoading = false;
                    if($routeParams.gamePlanId){
                        $scope.gameIdFound = true;
                        $scope.selected = $routeParams.gamePlanId;
                    }
                    $scope.messageToShow =  angular.copy($scope.messages);
                    $scope.managearray($scope.selected);
                });
            });
        };

        //do pagination
        $scope.paginate = function(arr){
            $scope.a = _.sortBy(arr, function (o) { return new Date(o.name); });
            $scope.total = arr.length;
            var tableState = $scope.tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
            if (tableState.sort.predicate) {
                filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
            }
            var result = filtered.slice(start, start + number);
            tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
            return result;
        }

        //filter array to show on gamePlanId
        $scope.managearray = function(id){
            if(id == 0){
                $scope.messageToShow =  angular.copy($scope.messages);
            }else{
                $scope.messageToShow = []
                angular.forEach($scope.messages, function(value) {
                  if(value.gamePlanId == id){
                    $scope.messageToShow.push(value);
                  }
                });
            }
            $scope.messageToShow = $scope.paginate($scope.messageToShow);
        }


        // open details of message
        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        // add message modal
        $scope.addModal = function() {
            if ($scope.gameIdFound){
                ModalService.showModal({
                    templateUrl: "views/simulation/game-messages/form.html",
                    controller: "messageCreateCtrl",
                    inputs:{
                        message: undefined,
                        gamePlanId: $routeParams.gamePlanId
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $scope.messagesTable($scope.tableState);
                        if (result && result !== ''){
                            // $scope.messages.unshift(result);
                        }
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/game-messages/form.html",
                    controller: "messageCreateCtrl",
                    inputs:{
                        message: undefined,
                        gamePlanId: undefined
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $scope.messagesTable($scope.tableState);
                    });
                });
            }
        };

        // edit given message
        $scope.edit = function(message, index) {
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
                    $scope.messagesTable($scope.tableState);
                });
            });
        };

        //deletes message
        $scope.deleteMessage = function (id, index) {
            $http.delete("/simulation/game-messages/remove/" + id)
                .then(function(res){
                    $scope.messagesTable($scope.tableState);
                    toastr.success('Message deleted.', 'Success!');
                });
        };

        //some wanted code for future for copy messages and assign to others

        // $scope.assignNewSimMessage = function (simMessage,ind) {
        //     ModalService.showModal({
        //         templateUrl: "views/assign-game-messages/form.html",
        //         controller: "assignSimualtionEditCtrl",
        //         inputs: {
        //             assignedMessage: simMessage,
        //         }
        //     }).then(function (modal) {
        //         modal.element.modal({ backdrop: 'static', keyboard: false });
        //         modal.close.then(function (result) {
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //             $scope.messagesTable($scope.tableState);
        //         });
        //     });
        // };

        // $scope.copy = function(message, index) {
        //     ModalService.showModal({
        //         templateUrl: "views/simulation/game-messages/copy-simulation-message.html",
        //         controller: "messageCopyCtrl",
        //         inputs:{
        //             message: message
        //         }
        //     }).then(function(modal) {
        //         modal.element.modal( {backdrop: 'static',  keyboard: false });
        //         modal.close.then(function(result) {
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //             $scope.messagesTable($scope.tableState);
        //         });
        //     });
        // };
    }


}());
