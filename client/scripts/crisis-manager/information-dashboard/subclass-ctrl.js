(function () {
    'use strict';

    angular.module('app')
        .controller('subClassCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'incidentID', 'classId','ClassService', subFunction]); 

        function subFunction($scope, close, $routeParams, $http, AuthService, incidentID, classId, ClassService) {

            function init() {
                /*var path = "class/all?incidentId=" + incidentID;
                $http.get(path).then(function(response) {
                    console.log(incidentID)
                    $scope.classes = response.data;
                });*/
             }

             $scope.close = function() {
 	            close();
             };

             $scope.submit = function(data) {
                 if(data !== undefined) {
                    data.classId = classId;
                    data.status = true;
                    ClassService.subClassSave(data).then(function(res){
                        toastr.success("Sub Category added successfully");
                        close();
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/class/sub-class/save', {data: data}).then(function(res) {
                        
                    // });
                 }

             }

             init();
        }
}());
