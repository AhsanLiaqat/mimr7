(function () {
    'use strict';

    angular.module('app')
    .controller('actionPlanDetailPageCtrl', ['$scope', '$rootScope', '$routeParams', '$http', 'AuthService', 'ModalService', 'filterFilter','Query','IncidentTypeService','ActionPlanService','IncidentPlanService', ctrlFunction]);
    function ctrlFunction($scope, $rootScope, $routeParams, $http, AuthService, ModalService, filterFilter ,Query, IncidentTypeService, ActionPlanService, IncidentPlanService) {

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('HH:mm DD-MM-YYYY');
        }

        function init() {
            if (Query.getCookie('incidentSelected') !== undefined) {
                var incident = Query.getCookie('incidentSelected');
                $scope.selectedAction = incident.action_plan;
                $scope.incident = incident;
                $scope.selectedAction.plandate = $scope.selectedAction.plandate ? setDateFormat($scope.selectedAction.plandate) : false;
                $scope.selected = [];
                $scope.statusOptions = [{ value: 'na', name: 'N/A' },
                { value: 'incomplete', name: 'Incomplete' },
                { value: 'in progress', name: 'In Progress' },
                { value: 'completed', name: 'Completed' }];

                ActionPlanService.incidentPlan($scope.selectedAction.id,$scope.incident.id).then(function(response){
                    $scope.incident_plan = response.data.action_plan.incident_plans[0];
                    $scope.activities = response.data.activities;
                    angular.forEach($scope.incident_plan.activity_status,function(activity_status, index){
                        $scope.activities[index].index = activity_status.index;
                    });
                    $scope.safeActivities = $scope.activities;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/action-plans/incident-plan?actionPlanId=" + $scope.selectedAction.id + "&incidentId=" + $scope.incident.id).then(function (response) {
                    
                // });
                IncidentTypeService.list().then(function(res){
                    $scope.categories = res.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/incident-types/list").then(function (res) {
                    
                // });
            } else {
                toastr.error('Please link an Action Plan to selected event first.', 'Error!');
            }
        };
        init();
        $scope.getStatusName = function(status){
            return filterFilter($scope.statusOptions, {'value': status})[0].name;
        }

        $scope.satusClass = function(status){
            switch (status) {
                case 'incomplete':
                return 'red-text';
                case 'in progress':
                return 'yellow-text';
                case 'completed':
                return 'green-text';
                case 'na':
                return 'black-text';
                default:
            }
        };

        $scope.selectAll = function (collection) {
            if ($scope.selected.length === 0) {
                angular.forEach(collection, function (val) {
                    $scope.selected.push(val.id);
                });
            } else if ($scope.selected.length > 0 && $scope.selected.length != $scope.activities.length) {
                angular.forEach(collection, function (val) {
                    var found = $scope.selected.indexOf(val.id);

                    if (found == -1) {
                        $scope.selected.push(val.id);
                    }
                });
            } else {
                $scope.selected = [];
            }
        };

        $scope.select = function (id) {
            var found = $scope.selected.indexOf(id);
            if (found == -1) {
                $scope.selected.push(id);
            }
            else {
                $scope.selected.splice(found, 1);
            }
        };

        $scope.changeStatus = function () {
            var answer = confirm('Are you sure to change the status?');
            if (answer) {
                $scope.incident_plan.plan_activated = !$scope.incident_plan.plan_activated;
                if ($scope.incident_plan.plan_activated == false){
                    angular.forEach($scope.incident_plan.activity_status, function (activity) {
                        activity.activated = false;
                        activity.task_status = 'incomplete';
                        activity.selected_outcome = null;
                    });
                }
                var body = {
                    current: $scope.incident_plan,
                    id: $scope.incident_plan.id
                }
                IncidentPlanService.update(body).then(function(response){
                    toastr.success('Status updated successfully.');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/incident-plan/update", body).then(function (response) {
                    
                // });
            }
            else {
                setTimeout(function () {
                    document.querySelector('.switcher').classList.toggle('active');
                }, 100);
            }
        };
        $scope.userStatusClass = function (availability) {
            return availability ? 'user-available' : 'user-unavailable'
        };

        $scope.checkDecision = function (activity) {
            if (activity && activity.type === 'decision' && activity.outcomes.length > 0) {
                return true;
            } else {
                return false;
            }
        };
        $scope.userStatusClass = function (availability) {
            return availability ? 'user-available' : 'user-unavailable'
        };

        $scope.checkDecision = function (activity) {
            if (activity && activity.type === 'decision' && activity.outcomes.length > 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.viewOutcomes = function (activity, index) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/action-plan-dashboard/outcomes.html",
                controller: "viewOutcomesCtrl",
                inputs: {
                    activity: activity,
                    incidentPlan: $scope.incident_plan,
                    index: index
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.incident_plan = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.selectedActivity = function () {
            var notSelected = true;
            angular.forEach($scope.activities, function (activity) {
                if (activity.isSelected && activity.isSelected === true) {
                    notSelected = false;
                }
            });
            return notSelected;
        };

        $scope.markActive = function () {
            angular.forEach($scope.activities, function (activity, index) {
                if (activity.isSelected && activity.isSelected === true) {
                    $scope.incident_plan.activity_status[index].activated = true;
                }
            });

            var body = {
                current: $scope.incident_plan,
                id: $scope.incident_plan.id
            }
            IncidentPlanService.update(body).then(function(response){
                toastr.success('Status updated successfully.');
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/incident-plan/update", body).then(function (response) {
                
            // });
        };

        $scope.updateActivityActivation = function ($index) {
            var time = new Date();
            $scope.incident_plan.activity_status[$index].activity_timestamp = time;
            setTimeout(function () {
                var body = {
                    current: $scope.incident_plan,
                    id: $scope.incident_plan.id
                }
                IncidentPlanService.update(body).then(function(response){
                    toastr.success('Status updated successfully.');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/incident-plan/update", body).then(function (response) {
                    
                // });
            }, 500);
        };
    }
}());
