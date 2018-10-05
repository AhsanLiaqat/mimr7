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
            
        };

        $http.get('/message/messages/all/' + $routeParams.gamePlanId).then(function (resp) {
            $scope.msg = resp.data;
        });

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
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    articleId: $routeParams.gamePlanId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.msg.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addMedia = function(record) {
            var inputs = {
                id: null,
                articleId: null,
                contentType : 'message-library',
                messageId : record.id
            };
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs: inputs
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    // if(result){
                    //     $scope.media.push(result);
                    // }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        // edit given message
        // $scope.edit = function(message, index) {
        //     ModalService.showModal({
        //         templateUrl: "views/simulation/game-messages/form.html",
        //         controller: "messageCreateCtrl",
        //         inputs:{
        //             message: message,
        //             gamePlanId: null
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

        //deletes message
        $scope.deleteMessage = function (id, index) {
            $http.delete("/message/messages/remove/" + id)
                .then(function(res){
                    $scope.msg.splice(index,1);
                    toastr.success('Message deleted.', 'Success!');
                });
        };
    }


}());