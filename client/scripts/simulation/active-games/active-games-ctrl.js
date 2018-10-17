(function () {
    'use strict';

    angular.module('app')
        .controller('activeGamesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'Query', activeGamesCtrl]);

    function activeGamesCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, Query) {

        $scope.pageItems = 10;
        $scope.user = Query.getCookie('user');
        if($routeParams.userId){
            $scope.user = {
                id: $routeParams.userId,
                userAccountId: $scope.user.userAccountId
            };
        }

        //function associated with table to fetch and set table data
        $scope.activeGamesTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $http.get('/simulation/schedule-games/active-games/' + $scope.user.id)
            .then(function (response) {
                $scope.a = response.data;
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.activeGames = result;
                if($scope.activeGames.length == 1){
                    $location.path("/simulation/my-messages/"+$scope.activeGames[0].id+"/"+$scope.user.id).search({multiple: 'false'});;
                }
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
                $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: $scope.activeGames.length}]
            });
        };

        //goto player page with messages of specific game
        $scope.goto = function (gameId,userId) {
            $location.path("/simulation/my-messages/"+gameId+"/"+userId).search({multiple: 'true'});;
        };

        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.setOffTimeFormat = function (dat) {
            return moment(dat).utc().local().format('mm:ss');
        };
    }
}());