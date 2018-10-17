(function () {
    'use strict';

    angular.module('app')
    .controller('sectionViewCtrl', ['$scope', 'close', '$http', '$filter', '$location', 'filterFilter','Query','section','ModalService','DepartmentService','ActivityService','OrganizationService','RoleService','TaskService', ctrlFunction]);

    function ctrlFunction($scope, close, $http, $filter, $location, filterFilter,Query,section,ModalService,DepartmentService,ActivityService, OrganizationService, RoleService, TaskService) {
        var init = function(){
            $scope.user = Query.getCookie('user');;
            $scope.section = section;
            OrganizationService.all($scope.user.userAccountId).then(function(response){
                $scope.organizations = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                $scope.departments = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function(response) {
                
            // });

            RoleService.all().then(function(response){
                $scope.roles = response.data;
                $scope.sortByCreate = _.sortBy($scope.roles, function (o) { return new Date(o.createdAt); });
                $scope.roles = $scope.sortByCreate.reverse();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function (response) {
                
            // });
            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });
            $http.get("/users/list").then(function (res) {
                $scope.users = res.data;
            });
        }
        $scope.addRole = function () {
            ModalService.showModal({
                templateUrl: "views/settings/roles/form.html",
                controller: "rolesCreateCtrl",
                inputs: {
                    role: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.roles.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.addTaskItem = function () {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    TaskService.all($scope.user.userAccountId).then(function(response){
                        $scope.tasks = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get('/settings/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                        
                    // });
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.addOrg = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/organization.template.html",
                controller: "OrganizationCreateCtrl",
                inputs: {
                    classes: null,
                    incident: null,
                    report: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.organizations.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.addDepartment = function () {
            ModalService.showModal({
                templateUrl: "views/settings/departments/form.html",
                controller: "departmentCreateModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.departments.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.addRole = function () {
            ModalService.showModal({
                templateUrl: "views/settings/roles/form.html",
                controller: "rolesCreateCtrl",
                inputs: {
                    role: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.roles.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.quickAddUser = function() {
            ModalService.showModal({
                templateUrl: "views/teams/user-create.html",
                controller:  "quickCreateUser",
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $scope.users.push(result);
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.updateTaskActivity = function (activity) {
          var data = { activity: activity, outcomes: [] };
          ActivityService.update(data).then(function(response){
            toastr.success("Activity updated successfully");
          },function(err){
            if(err)
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
          });
          // $http.post('/settings/activities/update', { data: data })
          //     .then(function (response) {
                  
          //     });
         };
        $scope.closeModal = function () {
            close(undefined);
        };
        init();
    }
}());
