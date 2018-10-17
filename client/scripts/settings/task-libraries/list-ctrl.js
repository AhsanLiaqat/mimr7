(function () {
    'use strict';

    angular.module('app')
    .controller('taskListCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService', 'Query','TagService','TaskService', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService, Query, TagService, TaskService) {
        $scope.user = Query.getCookie('user');
        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

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

        $scope.tasksTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $scope.user = Query.getCookie('user');
            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
                $scope.safeTasks = angular.copy($scope.tasks);
                $scope.a = _.sortBy($scope.tasks, function (o) { return new Date(o.title); });
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.tasks = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/tasks/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function(response) {
                
            // });
        };

        $scope.addModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "addTaskCtrl",
                inputs: {
                    taskAssign: false
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    $scope.tasksTable($scope.tableState);
                });
            });
        };

        $scope.EditFromWizard = function(task, index) {
            console.log('%%%%%%%%%%%%%%%%%%%%%%',task)
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "editTaskWizardCtrl",
                inputs: {
                    Task : task
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                   $('.modal-backdrop').remove();
                   $('body').removeClass('modal-open');
                   if (result && result !== ''){
                       $scope.tasks[index] = result;
                   }
               });
            });
        };

        $scope.deleteModal = function(task) {
            console.log(task)
            if(task.activities.length > 0){
                toastr.error("This task is being used in any Action plan, you cannot delete.",'Warning')
            }else{
                TaskService.delete(task.id).then(function(res){
                    toastr.success("Task deleted successfully.")
                    $route.reload();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/tasks/remove', {id: task.id}).then(function(res) {
                   
                // });
            }
        };

        $scope.setDateFormat = function(taskDate) {
            return moment.utc(taskDate).format('HH:mm DD-MM-YYYY');
        };
    }


}());
