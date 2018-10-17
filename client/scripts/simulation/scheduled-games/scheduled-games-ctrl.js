(function () {
    'use strict';

    angular.module('app')
        .controller('scheduledGamesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', gameRoleCtrl]);

    function gameRoleCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location) {

        //setting initial data 
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.arr = [
            {name: 'schedule',value: 'schedule'},
            {name: 'active',value: 'active'},
            {name: 'closed',value: 'closed'}
        ]
        if($routeParams.typeId){
           var id = $routeParams.typeId - 1;
          if(id == 0){
            $scope.gamesSelected = 'schedule';
          }else if(id == 1){
            $scope.gamesSelected = 'active';
          }else{
            $scope.gamesSelected = 'closed';
          }
        }else{
            $scope.gamesSelected = 'schedule';
        }
        $scope.gameToShow = []

        // function associated with table to fetch initial data
        $scope.gamesTable = function (tableState) {
            $scope.tableState = tableState;
            $scope.isLoading = true;
            $http.get('/simulation/schedule-games/all')
            .then(function (response) {
                $scope.games = response.data;
                $scope.managearray();
            });
        };
        
        //do pagination
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
            $scope.isLoading = false;
            return result;      
        }

        //filter array on schedule type status
        $scope.managearray = function(){
            if($scope.gamesSelected == 'schedule'){
                $scope.gameToShow = []
                angular.forEach($scope.games, function(value) {
                  if(value.plan_activated == false){
                    $scope.gameToShow.push(value);
                  }
                });
            }else if($scope.gamesSelected == 'active'){
                $scope.gameToShow = []
                angular.forEach($scope.games, function(value) {
                  if(value.plan_activated == true && value.status != 'stop'){
                    $scope.gameToShow.push(value);
                  }
                });
            }
            else{
                $scope.gameToShow = []
                angular.forEach($scope.games, function(value) {
                  if(value.status == 'stop'){
                    $scope.gameToShow.push(value);
                  }
                });
            }
            $scope.gameToShow = $scope.paginate($scope.gameToShow);
        }
        
        //schedule game
        $scope.scheduleNewGame = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/add-modal.html",
                controller: "newScheduledGameCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.games.unshift(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //play game to make it active
        $scope.playGame = function (gameId) {
            $http.post('/simulation/schedule-games/update/'+gameId, {plan_activated: true})
            .then(function(response){
                $scope.gamesTable($scope.tableState);
            });
        };

        //edit schedule game
        $scope.editGame = function (gameId, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/scheduled-games/edit-modal.html",
                controller: "editScheduledGameCtrl",
                inputs: { gameId: gameId }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.games[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //delete game
        $scope.deleteGame = function (gameId, index) {
            $http.delete("/simulation/schedule-games/remove/" + gameId)
                .then(function(res){
                    $scope.games.splice(index,1);
                    toastr.success('Game deleted.', 'Success!');
                });
        };

        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('DD-MM-YYYY');
        };
    }
}());