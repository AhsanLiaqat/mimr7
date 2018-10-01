(function () {
    'use strict';

    angular.module('app')
        .controller('newGamePlayerModalCtrl', ['$scope',
            'close',
            '$http',
            'AuthService',
            'player',
            
            'ModalService',
            ctrlFunction]);
    function ctrlFunction($scope,
                          close,
                          $http,
                          AuthService,
                          player,
                          
                          ModalService
    ) {
        
        // fetch and set initial data
        function init() {
            $scope.data = angular.copy(player) || {};
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
        };
        init();

        // add or edit player
        $scope.submit = function () {
            if (!$scope.data.firstName || $scope.data.firstName === '' || $scope.data.firstName == null
                && !$scope.data.lastName || $scope.data.lastName === '' || $scope.data.lastName == null
                && !$scope.data.email || $scope.data.email === '' || $scope.data.email == null
                && !$scope.data.organizationName || $scope.data.organizationName === '' || $scope.data.organizationName == null
                ){
                toastr.error('Enter valid details','Error!');
            } else{
                if (player){
                    $http.put('/simulation/game-players/update/' + player.id, {data: $scope.data})
                    .then(function (result) {
                        toastr.success('Player updated','Success!');
                        close($scope.data);
                    }, function (error) {
                        toastr.error(error, 'Error!');
                    })
                }else{
                    $scope.data.active = true;
                    $http.post('/simulation/game-players/create', $scope.data)
                    .then(function (result) {
                        toastr.success('Player created','Success!');
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