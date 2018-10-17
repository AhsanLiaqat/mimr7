(function () {
    'use strict';

    angular.module('app')
        .controller('addTaskCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', 'Query','DepartmentService','AllCategoryService','LibraryService','TagService','TaskService','OrganizationService','RoleService','taskAssign','ActivityService','ModalService', addFunction]);

    function addFunction($scope, close, $routeParams, $http, AuthService, Query, DepartmentService, AllCategoryService, LibraryService, TagService, TaskService, OrganizationService, RoleService,taskAssign, ActivityService, ModalService) {

        $scope.close = function (result) {
            close(result); // close, but give 500ms for bootstrap to animate
        };

        function init() {
            $scope.activity = {};
            $scope.assignTask = false;
            $scope.taskInfo = {};
            $scope.user = Query.getCookie('user');
            $scope.additionalInfo = false;
            $scope.taskTags = [];
            $scope.documents = [];
            $scope.heading = 'Add Task';
            $scope.addTask = true;
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
            $scope.types = [{},{name: "Information"},{name: "Action"},{name: "Agenda"},{name: "Other"}];
            LibraryService.all().then(function(response){
                $scope.library = response.data;
                _.each($scope.library, function (doc) {
                    if(doc.mimetype != null){
                        $scope.documents.push(doc);
                    }
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });

            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });

            OrganizationService.all($scope.user.userAccountId).then(function(response){
                $scope.organizations = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });

            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
                $scope.tags = $scope.tags.map(function (value) {
                    return {id: value.id, text:value.text};
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            //     // $scope.taskTags = $scope.tags;
            // });
            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                $scope.departments = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });

            $http.get("/users/list").then(function(res){
                $scope.users = res.data;
            });

            TaskService.all($scope.user.userAccountId).then(function(response){
                $scope.tasks = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/departments/all?userAccountId=" + $scope.user.userAccountId;
            // $http.get(path).then(function
            //         (response) {
                
            // });

            AuthService.user().then(function (res) {
                $scope.user = res;
            });
        }

        $scope.addTaskItem = function () {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    init();
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

        $scope.addRole = function (){
            ModalService.showModal({
                templateUrl: "views/settings/roles/form.html",
                controller: "rolesCreateCtrl",
                inputs: {
                    role: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result){
                        $scope.roles.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addDepartment = function (){
            ModalService.showModal({
                templateUrl: "views/settings/departments/form.html",
                controller: "departmentCreateModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.departments.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addOrg = function (){
            ModalService.showModal({
                templateUrl: "views/wizard/organization.template.html",
                controller: "OrganizationCreateCtrl",
                inputs: {
                    classes: $scope.classes,
                    incident: $scope.incident,
                    report: $scope.status_report
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.organizations.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addResponsibility = function (){
            ModalService.showModal({
                templateUrl: "views/settings/roles/form.html",
                controller: "rolesCreateCtrl",
                inputs: {
                    role: 1
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result){
                        $scope.activity.responsibility_level = result.name;
                        $scope.roles.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        init();
        $scope.toggleAdditionalInfo = function(){
            $scope.additionalInfo = !$scope.additionalInfo;
        }
        $scope.toggleAssignTask = function(){
            $scope.assignTask = !$scope.assignTask;
        }

        $scope.getList = function (query) {
            var filtered_array = $scope.tags.filter(function (val) {
                return val.text.indexOf(query) > -1;
            });
            return filtered_array;
        };


        $scope.submit = function () {
            var taskToGo = angular.copy($scope.task);
            var activityToGo = {};
            if($scope.assignTask == true && $scope.additionalInfo == true){
                taskToGo = angular.copy($scope.taskInfo);
                taskToGo.title = $scope.task.title;
                taskToGo.description = $scope.task.description;
                activityToGo = angular.copy($scope.activity);
            }else if($scope.assignTask == true){
                activityToGo = angular.copy($scope.activity);
            }else if($scope.additionalInfo == true){
                taskToGo = angular.copy($scope.taskInfo);
                taskToGo.title = $scope.task.title;
                taskToGo.description = $scope.task.description;
            }
            taskToGo.userAccountId = $scope.user.userAccountId;
            taskToGo.dateOfUpload = moment().utc().format();
            if ($scope.taskTags.length > 0){
                TagService.bulkSave($scope.taskTags).then(function(result){
                    TaskService.createWithTags({task: taskToGo,tags: $scope.taskTags}).then(function(response){
                        if(taskAssign){
                            activityToGo.userAccountId =  $scope.user.userAccountId;
                            activityToGo.response_time = 0;
                            activityToGo.completion_time = 0;
                            activityToGo.taskListId = response.data.id;
                            ActivityService.create({activity: activityToGo,outcomes: []}).then(function(resp){
                                toastr.success("Activity created successfully");
                                $scope.close(resp.data);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                        }
                        else{
                            toastr.success("Task added successfully.");
                            $scope.close(response.data);
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }else{
                TaskService.save(taskToGo).then(function(response){
                    if(taskAssign){
                        activityToGo.userAccountId =  $scope.user.userAccountId;
                        activityToGo.response_time = 0;
                        activityToGo.completion_time = 0;
                        console.log('--------------',response);
                        activityToGo.taskListId = response.data.id;
                        ActivityService.create({activity: activityToGo,outcomes: []}).then(function(resp){
                            toastr.success("Activity created successfully");
                            $scope.close(resp.data);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                    else{
                        toastr.success("Task added successfully.");
                        $scope.close(response.data);
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
            }
        };

        $scope.displayActorName = function(actor){
            var displayString = actor.firstName + ' ' + actor.lastName;
            if (actor.title){
                displayString = displayString + ', ' + actor.title;
            }
            if (actor.departmentId){
                displayString = displayString + ', ' + actor.department.name;
            }
            return displayString;
        }   



        function validateForm() {
            if (!$scope.task || !$scope.task.title || $scope.task.title === '') {
                toastr.error('Please provide a title.', 'Error!');
                return false;
            }
            return true;
        }
    }
}());