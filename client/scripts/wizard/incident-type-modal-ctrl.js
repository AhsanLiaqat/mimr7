(function () {
    'use strict';

    angular.module('app')
        .controller('incidentTypeAddCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService','IncidentTypeService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, IncidentTypeService) {
        
        function init() {
            $scope.data = {};


        }

        $scope.save = function(){
            console.log($scope.data.name);
            IncidentTypeService.save($scope.data).then(function(response){
                toastr.success("Incident saved successfully!");
                close(response.data);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/incident-types/save", $scope.data).then(function(response) {
                    
            // });
        };
        $scope.close = function() {
            close();
        }

        init();
        
    }
}());
