(function () {
    'use strict';

    angular.module('app')
        .controller('messageCopyCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter', 'message','ModalService', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter, message,ModalService) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        //fetch and set initial data
        function init() {
            $scope.documents = [];
            $scope.heading = 'Copy Message Modal';
            $scope.message = angular.copy(message);
            $scope.message.name = '';
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
            });
            $http.get('/simulation/game-libraries/all').then(function (response) {
                var library = response.data;
                _.each(library, function (doc) {
                    if(doc.mimetype !== null){
                        $scope.documents.push(doc);
                    }
                });
            });
            $scope.user = Query.getCookie('user');
        }
        init();
        
        // create copy message
        $scope.submit = function () {
            $scope.message.id = undefined;
            if (validateForm()) {
                $scope.message.userAccountId = $scope.user.userAccountId;
                $http.post('/simulation/game-messages/save', { data: $scope.message })
                .then(function (response) {
                    toastr.success("Message Copied.", "Success!");
                    close(response.data);
                });
            }
        };

        // validates form
        function validateForm() {
            if (!$scope.message.name || $scope.message.name === '') {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());