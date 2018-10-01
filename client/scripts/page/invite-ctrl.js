(function () {
    'use strict';

    angular.module('app')
        .controller('inviteCtrl', ['$scope', '$filter','$routeParams', '$http', 'AuthService', '$location', ctrlFunction]);

        function ctrlFunction($scope ,$filter,$routeParams, $http, AuthService, $location) {

             function init() {
                $scope.verifyPage =  true;
                $scope.newpass = false;
                $scope.data = {};
             }

             init();
             $scope.verify = function(){
                 $http.post('users/verify',{data:$scope.data}).then(function(res) {
                     $scope.user = res.data;
                     if($scope.user.id){
                        $scope.verifyPage =false;
                        $scope.newpass = true;
                        $scope.data = {};
                        toastr.success('Verified! please update your password here');
                    }else{
                        toastr.error('Record Not found! Please provide correct information');

                    }
               });
             }

             $scope.updatepass = function (){
                if($scope.data.password == $scope.data.confirm){
                    $scope.data.id = $scope.user.id;
                 $http.post('users/update',{data:$scope.data}).then(function(res) {
                        if(res.data){
                          $http.post('/users/updateChangePassword',{data:$scope.data}).then(function(res) {
                          });
                        toastr.success('updated Successfully! please login to continue');
                        $location.path('/pages/signin');
                        }
                    });
                }else{
                toastr.error('Password not match with confirm password');
                }
             }
             $scope.close = function() {
 	            close();
             };
        }
}());
