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
            'game_players',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          ModalService,
                          AccountService,
                          Query,
                          listId,
                          game_players
    ) {
        $scope.game_players = [];
        angular.forEach(game_players, function(itm){ $scope.game_players.push(itm.userId) });
        $scope.selectAll = function() {
            console.log($scope.allselected);
            $scope.allselected = !$scope.allselected;
            angular.forEach($scope.users, function(itm){ itm.selected = $scope.allselected; });
        }

        $scope.submit = function(){
            var list = Query.filter($scope.users,{selected: true},false);
            $http.post('/simulation/game-player-lists/import-players', {listId: listId,data: list,organization : $scope.client.name})
                .then(function (result) {
                    toastr.success('Player List Updated','Success!');
                    close(result.data);
                }, function (error) {
                    toastr.error(error, 'Error!');
            });    
        }    
        // fetch and set initial data

        AccountService.allOrganization().then(function(response){
                $scope.organizations = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });
        $scope.getUsers = function(){
            $http.post('/users/getOrganizationUsers', $scope.client)
            .then(function(response){
                $scope.users = response.data;
                angular.forEach($scope.users, function (elem) {
                    elem.selected = false;
                });
            }); 
        }
        //close modal
        $scope.close = function () {
            close();
        };
    }
}());