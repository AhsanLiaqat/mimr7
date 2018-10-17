(function () {
    'use strict';

    angular.module('app')
    .controller('viewOutcomesCtrl', ['$scope','$rootScope', 'close','$routeParams','$http','AuthService','activity','incidentPlan','index','IncidentPlanService',ctrlFunction]);

    function ctrlFunction($scope,$rootScope,close,$routeParams,$http,AuthService,activity,incidentPlan,index, IncidentPlanService) {
        function init() {
            $scope.activity = activity;
            $scope.incidentPlan = incidentPlan;
            $scope.index = index;
            var data = {outcomes: $scope.incidentPlan.activity_status[$scope.index].outcomes}
            $http.post("/incidentPlan/getActivityOutcomes", data).then(function (response) {
                $scope.outcomes = response.data.activities;
            });
        };

        init();

        $scope.userStatusClass = function(available){
            return available ? 'user-available' : 'user-unavailable'
        };

        $scope.updateOutcome = function(){
            var body = {
                current: $scope.incidentPlan,
                id: $scope.incidentPlan.id
            }
            IncidentPlanService.update(body).then(function(response){
                toastr.success('Status updated successfully.');
                close($scope.incidentPlan);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/incident-plan/update", body).then(function (response) {

            // });
        };

        $scope.close = function () {
            close();
        };
    }
} ());
