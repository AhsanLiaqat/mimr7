(function () {
    'use strict';

    angular.module('app')
    .controller('scenarioFormCtrl', ['$scope', 'close', '$routeParams', '$http', 'scenario','IncidentTypeService','ScenarioService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, scenario, IncidentTypeService, ScenarioService) {

        function init() {
            if($routeParams.id !== undefined) {
                $scope.classId = $routeParams.id;
            }
            IncidentTypeService.all().then(function(res){
                $scope.incidentTypes = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-types/all").then(function(res){
                
            // }); 
            if(scenario){
                $scope.data = scenario;
            }else{
                $scope.data = {};
            }
        }

        $scope.submit = function(){
            ScenarioService.save($scope.data).then(function(res){
                toastr.success("Scenario saved successfully!");
                close(res.data);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/scenarios/save", {data: $scope.data}).then(function(res){
                
            // }); 
        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
