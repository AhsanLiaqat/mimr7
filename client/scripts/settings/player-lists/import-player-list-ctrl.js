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

        function init(){
            $http.get('/settings/player-lists/get/' + listId).then(function(response){
                $scope.organization_player_list = response.data;
                $http.get('/users/get-organization-employ/' + $scope.organization_player_list.organizationId)
                .then(function(response){
                    $scope.users = response.data;
                    angular.forEach($scope.users, function (elem) {
                        elem.selected = false;
                    });
                }); 
            });
        }
        init();
        $scope.game_players = [];
        angular.forEach(players_list, function(itm){ 
            $scope.game_players.push(itm.player_lists_users.userId) 
        });

        $scope.submit = function(){
            var list = Query.filter($scope.users,{selected: true},false);
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