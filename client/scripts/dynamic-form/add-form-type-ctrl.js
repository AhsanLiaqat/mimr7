(function () {
    'use strict';

    angular.module('app')
    .controller('dynamicAddFormTypeCtrl', ['$scope','close','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','DynamicFormService','list', ctrlFunction]);

    function ctrlFunction($scope,close,$filter, $location, $routeParams, $http, AuthService, ModalService, Query, DynamicFormService,list) {
        
        $scope.data = list;
        $scope.submit = function () {
            if (!$scope.data.name || $scope.data.name === ''){
                toastr.error('Enter valid name','Error!');
            } else{
                if ($scope.data.id){
                    $http.post('form-types/update', {data: $scope.data})
                        .then(function (result) {
                            toastr.success('Player List updated','Success!');
                            close($scope.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }else{
                    $scope.data.active = true;
                    $http.post('form-types/create', {data: $scope.data})
                        .then(function (result) {
                            toastr.success('Form Type created','Success!');
                            close(result.data);
                        }, function (error) {
                            toastr.error(error, 'Error!');
                        })
                }
            }
        }
        $scope.close = function () {
            close();
        };
    }
}());
