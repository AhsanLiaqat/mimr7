(function () {
    'use strict';

    angular.module('app')
        .controller('addTeamModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'gamePlanId', 'filterFilter','Query', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, gamePlanId, filterFilter,Query) {

        //fetch and set initial data
        function init() {
            $scope.user = Query.getCookie('user');
            $scope.heading = 'Add Team';
            $scope.team = {};
            
        };
        init();

        // save 
        $scope.submit = function(){
            $scope.team.gamePlanId = gamePlanId;
            $scope.team.userAccountId = $scope.user.userAccountId;
            $http.post('/simulation/game-teams/save', { data: $scope.team }).then(function (response) {
                $scope.team = response.data;
                close($scope.team);
            });
        }
       
        
        $scope.saveExit = function (){
            close();
        };

        
    }
}());