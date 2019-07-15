(function () {
    'use strict';

    angular.module('app')
        .controller('playerListCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','Query', gamePlayerCtrl]);

    function gamePlayerCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location,Query) {
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selectoptions = [];
        $scope.selected = 0;
        $scope.roleToShow = [];
        $scope.user = Query.getCookie('user');

        
        // fecth and set some initial data
        $scope.playerListTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            $http.get('/settings/player-lists/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.playerlists = response.data;
                $scope.isLoading = false;
                $scope.roleToShow =  angular.copy($scope.playerlists);
                $scope.roleToShow = $scope.paginate($scope.roleToShow);
            });
        };

        // do pagination
        $scope.paginate = function(arr){
            $scope.a = arr;
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
        
        //opens modal to create new player list
        $scope.CreatePlayerList = function () {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/form.html",
                controller: "playerListModalCtrl",
                inputs: {
                    list: null,
                    organizationId : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerListTable($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //opens modal to edit given player list
        $scope.editPlayerList = function (list, index) {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/form.html",
                controller: "playerListModalCtrl",
                inputs: {
                    list: list,
                    organizationId : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerListTable ($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });  
        };
        $scope.importPlayers = function (listId,players) {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/importPlayerList.html",
                controller: "importPlayerListModalCtrl",
                inputs: {
                    listId: listId,
                    players_list : players
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerListTable($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });  
        };

        // deletes given player list
        $scope.deletePlayerList = function (listId, index) {
            $http.delete("/settings/player-lists/remove/" + listId)
            .then(function(res){
                $scope.playerListTable ($scope.tableState);
                toastr.success('Player List deleted.', 'Success!');
            });
        };
    }
}());