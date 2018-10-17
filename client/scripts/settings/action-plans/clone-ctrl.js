(function () {
    'use strict';

  angular.module('app')
    .controller('clonePlanModalCtrl', ['$scope',
                                        '$rootScope',
                                        'close',
                                        '$routeParams',
                                        '$http',
                                        'AuthService',
                                        '$location',
                                        '$timeout',
                                        '$filter',                                     
                                        'plan',
                                        'ActionPlanService',
                                        'PlanActivityService',
                                        ctrlFunction]);
    function ctrlFunction($scope,
                          $rootScope,
                          close,
                          $routeParams,
                          $http,
                          AuthService,
                          $location,
                          $timeout,
                          $filter,
                          plan,
                          ActionPlanService,
                          PlanActivityService) {

        function init() {
          $scope.plan = plan;
          $scope.newPlan = {};
          $scope.newPlan.name = $scope.plan.name + ' - Copy'
        };
        init();

        $scope.save = function (){
          if(!$scope.newPlan.name || $scope.newPlan.name === ''){
            toastr.error('Please provide a plan name','Error');
          }else{
            $scope.newPlan.description = $scope.plan.description;
            $scope.newPlan.plandate = $scope.plan.plandate;
            $scope.newPlan.scenario = $scope.plan.scenario;
            $scope.newPlan.status = $scope.plan.status;
            $scope.newPlan.type = $scope.plan.type;
            $scope.newPlan.categoryId = $scope.plan.categoryId;
            $scope.newPlan.userAccountId = $scope.plan.userAccountId;

            ActionPlanService.save($scope.newPlan).then(function(response){
              var data = {planId: $scope.plan.id, copiedPlanId: response.data.id};
              PlanActivityService.addCopiedActivities(data).then(function(res){
                $scope.close(response.data);
              },function(err){
                if(err)
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
              });
                // $http.post('/plan-activities/add-copied-activities', data)
                // .then(function (res){
                  
                // })
            },function(err){
              if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
              else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/action-plans/save', {data: $scope.newPlan})
            //   .then(function (response){
                
            // })
          }
        };

        $scope.close = function (params) {
          params = (params == null || params == undefined)?'': params; 
          close(params);
        };
    }
} ());