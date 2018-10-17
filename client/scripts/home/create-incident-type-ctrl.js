(function () {
    'use strict';

    angular.module('app')
        .controller('incidentTypeCreate', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService','IncidentTypeService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, IncidentTypeService) {
        
        function init() {
            
            
        }
            $scope.submit = function() {
                IncidentTypeService.save($scope.data).then(function(res){
                    close(res.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/settings/incident-types/save", $scope.data).then(function(res) {
                        
                // })
            };

        $scope.close = function() {
            close();
        }

        init();
        
    }
}());