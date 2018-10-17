(function () {
    'use strict';

    angular.module('app')
        .controller('showActionPlanActivitiesCtrl', ['$scope',
            '$rootScope',
            'close',
            'incidentPlan',
            'incidentId',
            '$routeParams',
            '$http',
            'AuthService',
            'ModalService',
            '$location',
            '$filter',
            'filterFilter',
            'Query',
            'ActionPlanService',
            'IncidentPlanService',
            ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        incidentPlan,
        incidentId,
        $routeParams,
        $http,
        AuthService,
        ModalService,
        $location,
        $filter,
        filterFilter,
        Query,
        ActionPlanService,
        IncidentPlanService
    ) {
        $scope.getClass = function(status){
            if(status == 'na'){
                return "black_class";
            }else if(status == 'incomplete'){
                return "red_class";
            }
            else if(status == 'in progress'){
                return "yellow_class";
            }
            else if(status == 'completed'){
                return "green_class";
            }
            else if(status == 'overdue'){
                return "orange_class";
            }
        }
        $scope.statusOptions = [{ value: 'na', name: 'N/A' },
            { value: 'incomplete', name: 'No Information' },
            { value: 'in progress', name: 'In Progress' },
            { value: 'completed', name: 'Completed' },
            { value: 'overdue', name: 'Overdue' }];

        var sortList = function () {
            angular.forEach($scope.planActivities.sections, function(section, index){
                $scope.planActivities.sections[index].incident_activities = _.sortBy($scope.planActivities.sections[index].incident_activities, function (activity) { return activity.tindex; });
            });
        };

        var sortTList = function () {
            $scope.planActivities.incident_activities = _.sortBy($scope.planActivities.incident_activities, function (activity) { return activity.index; });
        };
        $scope.displayActorName = function (actor) {
            return actor ? (actor.firstName + ' ' + actor.lastName) : 'N/A';
        };
        $scope.getStatusName = function (status) {
            return filterFilter($scope.statusOptions, { 'value': status })[0].name;
        }
        $scope.displayActivityProperty = function (property) {
            return property ? property.name : 'N/A'
        };
        $scope.taskInfo = function (activity) {
            ModalService.showModal({
                templateUrl: "views/actionPlanDashboard/task-info-modal.html",
                controller: "taskInfoModalCtrl",
                inputs: {
                    activity: activity,
                    showEditButton: false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.sectionView = function(){
            var data = {}
            data.actionPlanId = incidentPlan.action_plan.id;
            data.incidentId = incidentId;
            ActionPlanService.dashBoardSections(data).then(function(response){
                $scope.planActivities = response.data;
                if($scope.planActivities.sections){
                    $scope.planActivities.sections = _.sortBy(response.data.sections, function (msg) { return msg.index });
                }
                sortTList();
                sortList();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/action-plans/dash-board-sections', {data: data})
            // .then(function (response) {
                
            // });
        }

        function init() {
            $scope.incidentPlan = incidentPlan;
            $scope.user = Query.getCookie('user')
            IncidentPlanService.getActivities($scope.incidentPlan.id).then(function(response){
                $scope.planActivities = response.data;
                sortTList();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/incident-plan/get-activities?id=" + $scope.incidentPlan.id)
            // .then(function (response) {
                
            // });

        };
        init();

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('DD-MM-YYYY');
        }


        $scope.close = function () {
            close();
        };
    }
}());
