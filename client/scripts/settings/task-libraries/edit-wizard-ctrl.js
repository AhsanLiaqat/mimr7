(function () {
    'use strict';

    angular.module('app')
        .controller('editTaskWizardCtrl', ['$scope', 'close', '$http','Task','Query','DepartmentService','AllCategoryService','LibraryService','TagService','TaskService','RoleService','OrganizationService', viewFunction]);

        function viewFunction($scope, close, $http,Task,Query, DepartmentService, AllCategoryService, LibraryService, TagService, TaskService, RoleService, OrganizationService) {

            function init() {
                console.log(Task);
                $scope.task = angular.copy(Task);
                $scope.taskInfo = angular.copy(Task);
              
                if($scope.task && $scope.task.all_category){
                    $scope.task.categoryId = $scope.task.all_category.id
                }
                $scope.heading = 'Edit Task';
                $scope.editTask = true;
                $scope.types = [{},{name: "Information"},{name: "Action"},{name: "Agenda"},{name: "Other"}];
                $scope.user = Query.getCookie('user');
                DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                    $scope.departments = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                
                $scope.documents = [];

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


                AllCategoryService.list($scope.user.userAccountId).then(function(response){
                    $scope.categories = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

                });
                
                $http.get("/users/list").then(function(res){
                    $scope.users = res.data;
                });
                TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                    $scope.tags = response.data;
                    $scope.tags = $scope.tags.map(function (value) {
                        return {id: value.id, text:value.text};
                    });
                    console.log($scope.tags);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });

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
            }

            $scope.toggleAdditionalInfo = function(){
                $scope.additionalInfo = !$scope.additionalInfo;
            }
            $scope.toggleAssignTask = function(){
                $scope.assignTask = !$scope.assignTask;
            }
            $scope.close = function(result) {
 	            close(result);
            };

            $scope.submit = function() {
                $scope.taskInfo.title = $scope.task.title;
                $scope.taskInfo.description = $scope.task.description;
                if ($scope.taskInfo.tags && $scope.taskInfo.tags.length > 0){
                    TagService.bulkSave($scope.taskInfo.tags).then(function(response){
                        TaskService.updateWithTags($scope.taskInfo).then(function(response){
                            toastr.success("Update Successful");
                            close($scope.taskInfo);
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
                    TaskService.updateWithTags($scope.taskInfo).then(function(response){
                        toastr.success("Update Successful");
                        close($scope.taskInfo);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    
                }
            };

            $scope.getList = function (query) {
                var filtered_array = $scope.tags.filter(function (val) {
                    return val.text.indexOf(query) > -1;
                });
                console.log(filtered_array);
                return filtered_array;
            };

            init();
        }
}());
