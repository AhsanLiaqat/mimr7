(function () {
    'use strict';

    angular.module('app')
        .controller('createGameTemplateNameCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'filterFilter','ModalService','Query', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, filterFilter,ModalService,Query) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.heading = 'New Game Template Name';
            $scope.user = Query.getCookie('user');
            $scope.gameTemplate = {};
        }
        init();

        //save game template name
        $scope.submit = function () {

            if (validateForm()) {
                $scope.gameTemplate.userAccountId = $scope.user.userAccountId;
                if($scope.gameTemplate.id === undefined){
                    $http.post('/simulation/games/save', { data: $scope.gameTemplate })
                        .then(function (response) {
                            toastr.success("Game Template created.", "Success!");
                            close(response.data);
                        });
                } else {
                    $http.post('/simulation/games/update', {data: $scope.gameTemplate})
                        .then(function(response){
                            toastr.success("Game Template updated.", "Success!");
                            close(response.data);
                        });
                }
            }
        };

        function validateForm() {
            if (!$scope.gameTemplate.name || $scope.gameTemplate.name === '') {
                toastr.error('Please provide a valid Game Template name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());
