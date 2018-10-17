(function () {
    'use strict';

    angular.module('app')
        .controller('gamePlayerListModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'list',
            
            'ModalService',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          list,
                          
                          ModalService
    ) {
        
        
        // fetch and set initial data
        function init() {
            $scope.boys =[];
            $scope.data = angular.copy(list) || {};
            $scope.getPlayers();
            if($scope.data.id){
                angular.forEach($scope.data.game_players, function(player) {
                    $scope.boys.push(player.id);
                });
            }
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
        };
        $scope.getPlayers = function(){
            $http.get('/simulation/game-players/all').then(function (response) {
                $scope.gamePlayers = response.data;
            });
        } 
        init();
      
        // get fullname of given player
        $scope.getFullName = function(player){
            // if(player.organizationName){
            //     return player.organizationName + ' - ' +                 
            // }
            // else{
            //      return player.firstName + ' ' + player.lastName;   
            // }
            var name = (player.organizationName)? player.organizationName + ' - ' : '';
            return name + player.firstName + ' ' + player.lastName;
        } 

        //add or edit player list
        $scope.submit = function () {
            if (!$scope.data.name || $scope.data.name === ''){
                toastr.error('Enter valid name','Error!');
            } else{
                if (list){
                    $http.put('/simulation/game-player-lists/update/' + list.id, {data: $scope.data,players: $scope.boys})
                        .then(function (result) {
                            toastr.success('Player List updated','Success!');
                            close($scope.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }else{
                    $scope.data.active = true;
                    $http.post('/simulation/game-player-lists/create', {data: $scope.data,players: $scope.boys})
                        .then(function (result) {
                            toastr.success('Player List created','Success!');
                            close(result.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }
            }
        };

        //close modal
        $scope.close = function () {
            close();
        };
    }
}());