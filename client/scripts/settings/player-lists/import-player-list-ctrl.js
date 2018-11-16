(function () {
    'use strict';

    angular.module('app')
        .controller('importPlayerListModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'ModalService',
            'AccountService',
            'Query',
            'listId',
            'players_list',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          ModalService,
                          AccountService,
                          Query,
                          listId,
                          players_list
    ) {
        $http.get('/users/list2')
        .then(function(response){
            $scope.users = response.data;
            angular.forEach($scope.users, function (elem) {
                elem.selected = false;
            });
        }); 
        $scope.game_players = [];
        angular.forEach(players_list, function(itm){ 
            $scope.game_players.push(itm.player_lists_users.userId) 
        });

        $scope.submit = function(){
            var list = Query.filter($scope.users,{selected: true},false);
            console.log('++++++++++++++++++++++++++++',list)
            console.log('++++++++=================',listId)
            $http.post('/settings/player-lists/import-players', {listId: listId,data: list})
                .then(function (result) {
                    toastr.success('Player List Updated','Success!');
                    close(result.data);
                }, function (error) {
                    toastr.error(error, 'Error!');
            });    
        }    
            
        //close modal
        $scope.close = function () {
            close();
        };
    }
}());