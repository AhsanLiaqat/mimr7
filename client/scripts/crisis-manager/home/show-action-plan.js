(function () {
    'use strict';

    angular.module('app')
        .controller('showActionPlanCtrl', ['$scope',
            '$rootScope',
            'close',
            '$routeParams',
            '$http',
            'AuthService',
            'incident',
            'filterFilter',
            'ActionPlanService',
            'IncidentPlanService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        incident,
        filterFilter,
        ActionPlanService,
        IncidentPlanService) {

        function init() {
            $scope.planOptions = []
            $scope.shouldWarn = false;
            $scope.actionPlan = {};
            $scope.incident = angular.copy(incident);
            if ($scope.incident && $scope.incident.action_plan) {
                $scope.shouldWarn = true;
            }
            $scope.minus = [];
            angular.forEach($scope.incident.incident_plans, function(obj) {
                $scope.minus.push(obj.action_plan);
            });
            ActionPlanService.all().then(function(response){
                $scope.actions = filterFilter(response.data, { 'active': true });
                $scope.actions = _.sortBy($scope.actions, function (o) { return o.name.toLowerCase(); });
                console.log($scope.actions,$scope.minus);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/all').then(function (response) {
                
            // });
        };

        $scope.arrayFilter = function(e) {
          return !filterFilter($scope.minus, { 'id': e.id })[0];
        }
        var promptWarning = function () {
            if ($scope.shouldWarn) {
                if (confirm("Warning! Chaning Action Plan will result in loosing the current progress of Action Plan with the incident.")) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }

        $scope.save = function () {
            if (promptWarning()) {

                var planData = {
                    actionPlanId: $scope.actionPlan.id,
                    incidentId: $scope.incident.id
                }
                // var filteredPlan = filterFilter($scope.planOptions, { 'value': $scope.actionPlanId })[0];

                IncidentPlanService.save(planData).then(function(res){
                    res.data.incidentPlan.action_plan = {};
                        res.data.incidentPlan.action_plan.name = $scope.actionPlan.name;
                        if (res.data.outcomes.length > 0) {
                            IncidentPlanService.addOutcomes(res.data.outcomes).then(function(res){
                                toastr.success('Plan linked.', 'Success!');
                                $scope.close(res.data.incidentPlan);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                            //     .then(function (res) {
                                    
                            // })
                        } else {
                            toastr.success('Plan linked.', 'Success!');
                            $scope.close(res.data.incidentPlan);
                        }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/incident-plan/save", planData)
                //     .then(function (res) {
                        
                // });
            }
        }

        init();

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };

    }

}());
