(function () {
    'use strict';

    angular.module('app')
    .controller('IDMessageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {

        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selectoptions = [];
        $scope.selected = 0;
        $scope.messageToShow = []
        
        // function linked with page table to fetch initial data
        $scope.IDmessagesTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            $scope.user = Query.getCookie('user')
            var path = "/simulation/id-game-messages/all?accountId=" + $scope.user.userAccountId;
            
            $http.get(path).then(function(response) {
                $http.get('/simulation/id-games/all').then(function (resp) {
                    $scope.gameTemplates = resp.data;
                    $scope.selectoptions = angular.copy($scope.gameTemplates);
                    $scope.selectoptions.unshift({id: 0,name: 'All ID Games'});
                    
                    $scope.messages = response.data;
                    $scope.safeMessages = angular.copy($scope.messages);
                    $scope.isLoading = false;
                   
                     if($routeParams.gameId){
                        $scope.gameIdFound = true;
                        $scope.selected = $routeParams.gameId;
                    }
                    $scope.messageToShow = angular.copy($scope.messages);
                    console.log($scope.messages);
                    $scope.managearray($scope.selected);
                });
            });
        };

        // for pagiantion of display array 
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

        // manage message array filtered by game name
        $scope.managearray = function(id){
            if(id == 0){
                $scope.messageToShow = angular.copy($scope.messages);
            }else{
                $scope.messageToShow = []
                angular.forEach($scope.messages, function(value) {
                  if(value.idGameId == id){
                    $scope.messageToShow.push(value);
                  }
                });
            }
            $scope.messageToShow = $scope.paginate($scope.messageToShow);
        }
        // add new ID message
        $scope.addModal = function() {
            //check if game already selected
            if ($scope.gameIdFound){
                ModalService.showModal({
                    templateUrl: "views/simulation/id-messages/create-id-message-modal.html",
                    controller: "IDMessageModalCtrl",
                    inputs:{
                        message: null,
                        gameId: $routeParams.gameId
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $scope.IDmessagesTable($scope.tableState);
                        
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/id-messages/create-id-message-modal.html",
                    controller: "IDMessageModalCtrl",
                    inputs:{
                        message: null,
                        gameId: null
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        $scope.IDmessagesTable($scope.tableState);
                    });
                });
            }
        };

        //edit message modal
        $scope.edit = function(message, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/id-messages/create-id-message-modal.html",
                controller: "IDMessageModalCtrl",
                inputs:{
                    message: message,
                    gameId: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.IDmessagesTable($scope.tableState);
                });
            });
        };
       
        //delete message
        $scope.deleteMessage = function (id, index) {
            $http.delete("/simulation/id-game-messages/remove/" + id)
                .then(function(res){
                    toastr.success('Message deleted.', 'Success!');
                    $scope.IDmessagesTable($scope.tableState);
                });
        };
    }
    

}());