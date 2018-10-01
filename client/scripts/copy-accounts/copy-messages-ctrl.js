(function () {
    'use strict';

    angular.module('app')
    .controller('copyMessagesCtrl', ['$scope', 'ModalService', '$routeParams', '$http','$location','AccountService', ctrlFunction]);
    function ctrlFunction($scope, ModalService, $routeParams, $http, $location, AccountService) {

        function init(){
            $scope.data = {};
            AccountService.all().then(function(res){
                $scope.accounts = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/accounts/all').then(function(res){
                
            // })
            $scope.things = ['Messages','Categories','Roles','Incident Types','Departments','Color Palettes','Tasks','Dynamic Forms','Simulation Games','Information Simulation Games'];
            $scope.values = [false,false,false,false,false,false];
        };

        $scope.copyMessages = function(){
            AccountService.copyMessages($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-messages',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyTasks = function(){
            AccountService.copyTasks($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-messages',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyDynamicForms = function(){
            AccountService.copyDynamicForms($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-messages',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyColors = function(){
            AccountService.copyColors($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-colors',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyDepartments = function(){
            AccountService.copyDepartments($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-departments',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyRoles = function(){
            AccountService.copyRoles($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-roles',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyIncidentTypes = function(){
            AccountService.copyIncidentTypes($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-incident-types',{data: $scope.data}).then(function(res){
                
            // })
        }

        $scope.copyCategories = function(){
            AccountService.copyCategories($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-account-categories',{data: $scope.data}).then(function(res){
                
            // })
        }

        $scope.copySimulationGames = function(){
            AccountService.copySimulationGames($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-account-categories',{data: $scope.data}).then(function(res){
                
            // })
        }
        $scope.copyInformationGames = function(){
            AccountService.copyInformationGames($scope.data).then(function(res){
                $location.path('/superadmin');
            },function(err){
                 if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/accounts/copy-account-categories',{data: $scope.data}).then(function(res){
                
            // })
        }

        $scope.submit = function(){
            if($scope.data.accountIdFrom && $scope.data.accountIdTo){
                if($scope.data.accountIdFrom == $scope.data.accountIdTo){
                    toastr.error("Accounts can't be same");
                }else{
                    angular.forEach($scope.values, function(value,ind) {
                        if(value){
                            if($scope.things[ind] == 'Messages'){
                                $scope.copyMessages();
                            }
                            else if($scope.things[ind] == 'Categories'){
                                $scope.copyCategories();
                            }
                            else if($scope.things[ind] == 'Roles'){
                                $scope.copyRoles();
                            }
                            else if($scope.things[ind] == 'Incident Types'){
                                $scope.copyIncidentTypes();
                            }
                            else if($scope.things[ind] == 'Departments'){
                                $scope.copyDepartments();
                            }
                            else if($scope.things[ind] == 'Color Palettes'){
                                $scope.copyColors();
                            }
                            else if($scope.things[ind] == 'Tasks'){
                                $scope.copyTasks();
                            }
                            else if($scope.things[ind] == 'Dynamic Forms'){
                                $scope.copyDynamicForms();
                            }
                            else if($scope.things[ind] == 'Simulation Games'){
                                $scope.copySimulationGames();
                            }
                            else if($scope.things[ind] == 'Information Simulation Games'){
                                $scope.copyInformationGames();
                            }
                        }
                    });
                }
            }else{
                toastr.warning('Select Accounts Please','Warning');
            }
        }
        init();
    }
}());
