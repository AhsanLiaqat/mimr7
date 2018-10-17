(function () {
    'use strict';

    angular.module('app')
    .controller('taskLinkModalCtrl', ['$scope', 'close', '$filter', '$location', '$routeParams','$route', '$http', 'AuthService', 'checklist','incident','ModalService','Query','AllCategoryService','CheckListService','TaskService', ctrlFunction]);
    function ctrlFunction($scope, close, $filter, $location, $routeParams,$route, $http, AuthService, checklist,incident,ModalService,Query, AllCategoryService, CheckListService, TaskService) {

        function init() {
            $scope.selectedTask = [];
            $scope.searchKeywords = '';
            $scope.selected = [];
            $scope.checklist = checklist;
            $scope.user = Query.getCookie('user');
            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
                if($scope.checklist.tasks !== undefined){
                    angular.forEach($scope.checklist.tasks, function(stask, key1) {
                        angular.forEach($scope.tasks, function(task, key2) {
                            if(stask.id == task.id){
                                $scope.selected.push(task.id);
                                task.checked = true;
                            }
                        });
                    });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/tasks/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function(response) {
                
            // });
            AllCategoryService.list($scope.user.userAccountId).then(function(response){
                $scope.categories = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list?accountId=" + $scope.user.userAccountId).then(function(response) {
                
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
                    init();
                });
            });
        };
        $scope.unselectTask = function(task){
            task.checked = !task.checked
            if (task.checked == false){
                angular.forEach($scope.selected, function(stask, key1) {
                    if (stask == task.id){
                        $scope.selected.splice(key1, 1);
                        $scope.selectedTask.splice(key1, 1);
                    }
                });
            }else{
                $scope.selected.push(angular.copy(task.id));
                task.status = 'incomplete';
                $scope.selectedTask.push(angular.copy(task));
            }
        };
        $scope.submit = function() {
            if(typeof $scope.checklist.createdAt == 'string'){
                $scope.checklist.createdAt = $scope.checklist.updatedAt;
            }
            $scope.checklist.tasks = $scope.selected;
            if (incident) {
                $scope.checklist.incidentId = incident.id;
            }

            if($scope.checklist.id == undefined){
                console.log($scope.checklist,'tasks');
                CheckListService.save($scope.checklist).then(function(response){
                    toastr.success("checklist created successfully!");
                    $scope.checklist.id = response.data.id;
                    delete $scope.checklist.tasks;
                    $scope.checklist.tasks = $scope.selectedTask;
                    close($scope.checklist);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/check-lists/save', {data: $scope.checklist}).then(function(response) {
                    
                // });
            }else{
                CheckListService.update($scope.checklist).then(function(response){
                    toastr.success("checklist updated successfully!");
                    close($scope.checklist);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/check-lists/update', {data: $scope.checklist}).then(function(response) {
                    
                // });
            }
        };
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.tasks = $filter('orderBy')($scope.tasks, rowName);

        };
        $scope.close = function() {
            close();
        }
        init();
    }
}());
