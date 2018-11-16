(function () {
    'use strict';

    angular.module('app')
        .controller('selectPlayerListModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'ModalService',
            'AccountService',
            'Query',
            'game_players',
            ctrlFunction]);
    function ctrlFunction(
        $scope,
        close,
        $http,
        AuthService,
        ModalService,
        AccountService,
        Query,
        game_players
    ) {
        $scope.game_players = game_players;
        $http.get('/simulation/game-player-lists/all').then(function (response) {
            $scope.playerlists = response.data;
            angular.forEach($scope.playerlists, function(list){
                angular.forEach(list.game_players, function(player){
                    player.selected = false;
                });
            });
        });
        // angular.forEach(game_players, function(itm){ $scope.game_players.push(itm.userId) });
        $scope.selectAll = function() {
            $scope.allselected = !$scope.allselected;
            angular.forEach($scope.users, function(itm){ itm.selected = $scope.allselected; });
        }

        $scope.submit = function(){
            var list = Query.filter($scope.client.game_players,{selected: true},false);
            close(list);
        }
        // fetch and set initial data
        //close modal
        $scope.close = function () {
            close();
        };
    }
}());