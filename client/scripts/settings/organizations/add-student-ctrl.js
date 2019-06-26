(function () {
    'use strict';

    angular.module('app')
    .controller('newStudentCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','close','studentId','organizationId', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query, close,studentId,organizationId) {
        $scope.init = () => {
            $scope.studentId = studentId;
            $scope.organizationId = organizationId;
            $scope.user = Query.getCookie('user');
            if($scope.studentId){
                $http.get('settings/students/get/' + $scope.studentId)
                .then(function(res){
                    $scope.data = res.data;
                    $scope.organizationId = $scope.data.organizationId;
                });    
            }else{
                $scope.data = {active : 'Active'}
            }
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                $scope.organizations = response.data;
            });

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
                        $scope.data.type = 'student';
                        $scope.data.password = '12345678';
                        $http.post('/settings/students/update/' + $scope.studentId,{data : $scope.data})
                        .then(function(res){
                            $scope.rslt = res.data;
                            let answerQuestions = 0;
                            angular.forEach($scope.rslt.question_schedulings,function(item){
                                if(item.answer){
                                    answerQuestions++;
                                }
                            });
                            $scope.rslt.answerQuestions = answerQuestions;
                            toastr.success('Students Updated.', 'Success!');
                            close($scope.rslt);
                        });
                    }
                });
                
            }else{
                $http.post('/settings/students/One',{data: {email: $scope.data.email}}).then(function(res) {
                    if(res.data.id){
                        toastr.error('Students Aleardy Exist with Email provided!');
                    }else{
                        if($scope.organizationId){
                            $scope.data.organizationId = $scope.organizationId;
                            $scope.data.type = 'student';
                            $scope.data.password = '12345678';
                            $http.post('/settings/students/save',{data : $scope.data})
                            .then(function(res){
                                $scope.result = res.data;
                                $scope.result.answerQuestions = 0;
                                toastr.success('Students Added.', 'Success!');
                                close($scope.result);
                            });
                        }else{
                            toastr.error('please enter all fields');
                        }
                    }
                });
                
            }
                
        };

        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };
    }
}());