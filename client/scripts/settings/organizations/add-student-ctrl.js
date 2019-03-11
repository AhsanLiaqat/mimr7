(function () {
    'use strict';

    angular.module('app')
    .controller('newStudentCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','studentId','organizationId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,studentId,organizationId) {
        $scope.init = () => {
            $scope.studentId = studentId;
            $scope.organizationId = organizationId;
            if($scope.studentId){
                $http.get('settings/students/get/' + $scope.studentId)
                .then(function(res){
                    $scope.data = res.data;
                });    
            }
        }
        $scope.init();

        $scope.save = () => {
            if($scope.studentId){
                $http.post('/settings/students/CheckEmail',{data: {email: $scope.data.email, 
                                                        id: $scope.data.id}})
                .then(function(res) {
                    if(res.data.length > 0){
                        toastr.error('Students Aleardy Exist with Email provided!');
                    } else {
                        $scope.data.organizationId = $scope.organizationId;
                        $http.post('/settings/students/update/' + $scope.studentId,{data : $scope.data})
                        .then(function(res){
                            $scope.data = res.data;
                            toastr.success('Students Updated.', 'Success!');
                            close(res.data);
                        });
                    }
                });
                
            }else{
                $http.post('/settings/students/One',{data: {email: $scope.data.email}}).then(function(res) {
                    if(res.data.id){
                        toastr.error('Students Aleardy Exist with Email provided!');
                    }else{
                        $scope.data.organizationId = $scope.organizationId;
                        $http.post('/settings/students/save',{data : $scope.data})
                        .then(function(res){
                            $scope.data = res.data;
                            toastr.success('Students Added.', 'Success!');
                            close(res.data);
                        });
                    }
                });
                
            }
                
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());