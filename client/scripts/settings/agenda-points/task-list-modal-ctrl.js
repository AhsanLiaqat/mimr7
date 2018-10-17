(function () {
    'use strict';

    angular.module('app')
    .controller('taskListModalCtrl', ['$scope', 'close', '$filter', '$location', '$routeParams','$route', '$http', 'AuthService','ModalService','Query','AllCategoryService','CheckListService','TaskService','agendapoint','AgendaPointService','ActivityService','actionPlanId','incidentId','selectedIncidentPlanId', ctrlFunction]);
    function ctrlFunction($scope, close, $filter, $location, $routeParams,$route, $http, AuthService,ModalService,Query, AllCategoryService, CheckListService, TaskService, agendapoint, AgendaPointService, ActivityService,actionPlanId,incidentId, selectedIncidentPlanId) {

        function init() {
            $scope.selectedTask = [];
            $scope.searchKeywords = '';
            $scope.selected = [];
            // $scope.categoryArray = [];
            // $scope.
            $scope.agendapoint = agendapoint;
            $scope.actionPlanId = actionPlanId;
            $scope.selectedIncidentPlanId = selectedIncidentPlanId;
            $scope.incidentId = incidentId;
            $scope.user = Query.getCookie('user');
            ActivityService.all($scope.user.userAccountId).then(function(response){
                $scope.activities = response.data;
                $scope.filteredActivities = $scope.activities;
                $scope.order('task_list.all_category.name');
                if($scope.agendapoint){
                    if($scope.agendapoint.agenda_activities !== undefined){
                        angular.forEach($scope.agendapoint.agenda_activities, function(stask, key1) {
                            console.log(stask,$scope.selected)
                            angular.forEach($scope.activities, function(activity, key2) {
                                if(stask.activityId == activity.id){
                                    $scope.selected.push(activity.id);
                                    $scope.selectedTask.push(angular.copy(activity));
                                    // activity.checked = true;
                                }
                            });
                        });
                    }
                    if($scope.agendapoint.incident_agenda_activities !== undefined){
                        angular.forEach($scope.agendapoint.incident_agenda_activities, function(stask, key1) {
                            angular.forEach($scope.activities, function(activity, key2) {
                                if(stask.activityId == activity.id){
                                    $scope.selected.push(activity.id);
                                    $scope.selectedTask.push(angular.copy(activity));
                                    // activity.checked = true;
                                }
                            });
                        });
                    }
                }
            });
        };

        $scope.selectAll = function() {
            if($scope.allselected){
                $scope.selected = $scope.filteredActivities.map(function(act) {
                    return act.id;
                });
                $scope.selectedTask = $scope.filteredActivities;
            }else{
                $scope.selected = [];
                $scope.selectedTask = [];
            }
        }

        $scope.$watch('searchKeywords', function(val) {
            $scope.filteredActivities = getFilteredData(val, ['id']);
            $scope.allselected = false;
        });
        var getFilteredData = function(filter, except) {
            if($scope.activities){
                return filter ? $scope.activities.filter(function(item) {
                    return contains(item, filter, except)
                }) : $scope.activities.slice(0);
            }
        }

        function contains(src, value, except) {
            var key;
            switch(typeof src) {
                case 'string':
                case 'number':
                case 'boolean':
                return String(src).indexOf(value) > -1;
                case 'object':
                except = except || [];
                for(key in src) {
                    if( src.hasOwnProperty(key) &&
                        except.indexOf(key) < 0 &&
                        contains(src[key], value, except)
                    ) {
                        return true;
                    }
                }
            }
            return false;
        }

        $scope.addModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "addTaskCtrl",
                inputs: {
                    taskAssign: true
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result){
                        $scope.activities.push(result.data);
                        $scope.order('task_list.all_category.name');
                    }
                });
            });
        };
        $scope.unselectActivity = function(activity){
            // activity.checked = !activity.checked
            if ($scope.selected.includes(activity.id)){
                angular.forEach($scope.selected, function(stask, key1) {
                    if (stask == activity.id){
                        $scope.selected.splice(key1, 1);
                        $scope.selectedTask.splice(key1, 1);
                    }
                });
            }else{
                activity.status = 'incomplete';
                $scope.selected.push(angular.copy(activity.id));
                $scope.selectedTask.push(angular.copy(activity));
            }
            console.log($scope.selected);
        };
        $scope.submit = function() {
            if($scope.actionPlanId){
                var selectedIds = $scope.selectedTask.map(function(act) {
                    return {activityId: act.id, tasklistId: (act.task_list)? act.task_list.id : null , name : act.task_list.title};
                });
                var toData = {
                    agendaPointId: $scope.agendapoint.id,
                    actionPlanId: $scope.actionPlanId,
                    selected : selectedIds,
                    incident_plan_id: $scope.selectedIncidentPlanId,
                    incidentId : $scope.incidentId
                }
                ActivityService.incidentAgendaActivity(toData).then(function(response){
                    toastr.success('Task List created','Success!');
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }else{
                AgendaPointService.saveActivityList({data : $scope.agendapoint.id, selected : $scope.selectedTask}).then(function(response){
                    toastr.success('Task List created','Success!');
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
        };
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredActivities = $filter('orderBy')($scope.activities, rowName);

        };
        $scope.close = function() {
            close();
        }
        init();
    }
}());
