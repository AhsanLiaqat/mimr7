(function () {
    'use strict';
    angular.module('app')
    .controller('activitiesListCtrl', ['$scope', '$http', '$filter', '$route', 'ModalService','Query','ActivityService','TagService','TaskService','CheckListService', activitiesCtrl]);
    function activitiesCtrl($scope, $http, $filter, $route, ModalService,Query,ActivityService, TagService, TaskService,CheckListService) {

        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.AssignedTasks = false;
        $scope.unassign = true;
        $scope.user = Query.getCookie('user');
        $scope.title ='UNASSIGNED TASKS';

        $scope.init = function(){
            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.taskLists = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/tasks/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function(response) {
                
            // });

            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });

        }
        $scope.init();
        $scope.user = Query.getCookie('user');
        $scope.activitiesTable = function (tableState) {
            $scope.tableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            ActivityService.all($scope.user.userAccountId).then(function(response){
                $scope.activities = response.data;
                $scope.sortByCreate = _.sortBy($scope.activities, function (o) { return new Date(o.createdAt); });
                $scope.total = response.data.length;
                $scope.a = $scope.sortByCreate.reverse();
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.activities = result;
                
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "settings/check-lists/list?accountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };






        $scope.NottasksTable = function (tableState) {
            $scope.NottableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.notAssigned =[];
            
            TaskService.unAssignedAll($scope.user.userAccountId).then(function(response){
                angular.forEach(response.data, function (task) {
                    if(task.activities.length == 0){
                        $scope.notAssigned.push(task);
                    }
                });
                $scope.sortByCreate = _.sortBy($scope.notAssigned, function (o) { return new Date(o.createdAt); });
                $scope.total = response.data.length;
                $scope.a = $scope.sortByCreate.reverse();
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.notAssigned = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "settings/check-lists/list?accountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };


        $scope.createActivity = function () {
            ModalService.showModal({
                templateUrl: "views/settings/activities/add.html",
                controller: "addActivityModalCtrl",
                inputs: {
                    incident: $scope.incident,
                    task : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        $route.reload();
                    }
                });
            });
        };
        $scope.unAssigned = function(){
            $scope.AssignedTasks = false;
            $scope.unassign = true;
            $scope.title ='UNASSIGNED TASKS';
        };
        $scope.assigned = function(){
            $scope.AssignedTasks = true;
            $scope.unassign = false;
            $scope.title = 'Assigned Tasks';
        };
        $scope.createActivityWizard = function () {
            ModalService.showModal({
                templateUrl: "views/settings/activities/add.html",
                controller: "addActivityModalCtrl",
                inputs: {
                    incident: $scope.incident,
                    task : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        $scope.activities.unshift(result);
                    }
                });
            });
        };
        $scope.assignToActivity = function (task,index) {
            ModalService.showModal({
                templateUrl: "views/settings/activities/add.html",
                controller: "addActivityModalCtrl",
                inputs: {
                    incident: $scope.incident,
                    task: task
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        $scope.activities.unshift(result);
                        $scope.notAssigned.splice(index,1);
                    }
                });
            });
        };


        $scope.editActivity = function (activity, index) {
            ModalService.showModal({
                templateUrl: "views/settings/activities/edit.html",
                controller: "editActivityModalCtrl",
                inputs: {
                    activity: activity,
                    tasks: $scope.taskLists
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        $route.reload();
                    }
                });
            });
        };
        $scope.editActivityWizard = function (activity, index) {
            ModalService.showModal({
                templateUrl: "views/settings/activities/edit.html",
                controller: "editActivityModalCtrl",
                inputs: {
                    activity: activity,
                    tasks: $scope.taskLists
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result !== '' && typeof result !== 'undefined'){
                        $scope.activities[index] = angular.copy(result);
                    }
                });
            });
        };
        $scope.deleteActivityWizard = function (activityId,index) {
            ActivityService.delete(activityId).then(function(response){
                 toastr.success("Activity deleted successfully");
                $scope.activities.splice(index,1);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.delete('/settings/activities/remove?id='+activityId).then(function(response) {
               
            // });
        };
    };

})();
