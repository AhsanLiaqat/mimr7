(function () {
    'use strict';

    angular.module('app')
        .controller('gamePlayerCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', gamePlayerCtrl]);

    function gamePlayerCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location) {
        // variables to use for pagination
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selectoptions = [];
        $scope.selected = 0;
        $scope.playersToShow = [];
        $scope.selectoptions.push({id: 0,name: 'All Game Templates'});

        // fetch and set initial data
        $scope.playerTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            $http.get('/simulation/game-players/all').then(function (response) {
                $scope.players = response.data;
                $scope.isLoading = false;
                $scope.playersToShow =  angular.copy($scope.players);
                $scope.playersToShow = $scope.paginate($scope.playersToShow);
            });
        };
        //method which do pagination
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

        //add new player
        $scope.CreateGamePlayer = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/players/form.html",
                controller: "newGamePlayerModalCtrl",
                inputs: {
                    player: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerTable($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //edit given player
        $scope.editPlayer = function (player, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/players/form.html",
                controller: "newGamePlayerModalCtrl",
                inputs: {
                    player: player
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerTable ($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });  
        };

        //delete given player
        $scope.deletePlayer = function (roleId, index) {
            $http.delete("/simulation/game-players/remove/" + roleId)
                .then(function(res){
                    $scope.playerTable ($scope.tableState);
                    toastr.success('Player deleted.', 'Success!');
                });
        };
    }
}());