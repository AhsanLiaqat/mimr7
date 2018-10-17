(function () {
    'use strict';

    angular.module('app')
        .controller('IDMessageModalCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'filterFilter', 'message','gameId','ModalService','Query', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, filterFilter, message,gameId,ModalService,Query) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        // fetch and setting initial data
        function init() {
            $scope.message = message;
            if(message){
                $scope.message = message;
                $scope.heading = 'Edit Simulation Message';
            }else{
                $scope.heading = 'New ID Message';
                $scope.message = {};
                if(gameId){
                    $scope.found = true;
                    $scope.message.idGameId = gameId;
                }
            }
            $scope.documents = [];
            $scope.rolesToShow = [];
            $scope.orderSequence = [];
            for(var i = 0 ; i < 100 ; i++){
                $scope.orderSequence.push({id: i, value: i});
            }
            $http.get('/simulation/id-games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            $scope.user = Query.getCookie('user');
        }
        init();

        // front end validations
        function validateForm() {
            if (!$scope.message.message || $scope.message.message === '' ) {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            else if (!$scope.message.idGameId || $scope.message.idGameId === '' ) {
                toastr.error('Please select a Game.', 'Error!');
                return false;
            }
            return true;
        }
        
        //save id message
        $scope.submit = function () {
            if (validateForm()) {
                $scope.message.userAccountId = $scope.user.userAccountId;
                if($scope.message.id === undefined){
                    $http.post('/simulation/id-game-messages/create', { data: $scope.message })
                    .then(function (response) {
                        toastr.success("Message created.", "Success!");
                        close($scope.message);
                    });
                } else {
                    $http.put('/simulation/id-game-messages/update/'+$scope.message.id, {data: $scope.message})
                        .then(function(response){
                            toastr.success("Message updated.", "Success!");
                            close($scope.message);
                        });
                }
            }
        };
        
    }
}());