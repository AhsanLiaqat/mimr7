(function () {
    'use strict';

    angular.module('app')
        .controller('addMessageCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','messageId','user', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, filterFilter,ModalService, messageId, user) {

        //close modal
        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };
        function init() {
            $scope.user = user;
            $scope.messageId = messageId;
            if($scope.messageId){
                $http.get('/student-message/get/' + $scope.messageId).then(function (response) {
                    $scope.message = response.data;
                });
                
            }
        }
        init();

        //save new game message
        $scope.submit = function () {
            if($scope.messageId){
                $http.post("/student-message/update" , { data: $scope.message }).then(function (res) {
                    close(res.data);
                });
            }else{
                if($scope.message){
                    $scope.message.userId = $scope.user.id;
                    $scope.message.status = 'InActive';
                    $http.post("/student-message/save" , { data: $scope.message }).then(function (res) {
                        close(res.data);
                    });
                }else{
                    toastr.error('please fill all fields');                    
                }
            }
        };

        //validates message input
        function validateForm() {
            if (!$scope.message.content || $scope.message.content === '') {
                toastr.error('Please provide a valid message name.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());
