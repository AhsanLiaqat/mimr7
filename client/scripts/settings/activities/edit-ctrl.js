(function () {
    'use strict';

    angular.module('app')
    .controller('editActivityModalCtrl', ['$scope', '$rootScope', 'close', 'activity', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', '$timeout', '$filter', 'tasks', 'Query','DepartmentService','ActivityService','IncidentTeamService','OrganizationService','RoleService', ctrlFunction]);
    function ctrlFunction($scope, $rootScope, close, activity, $routeParams, $http, AuthService, ModalService, $location, $timeout, $filter, tasks, Query, DepartmentService,ActivityService, IncidentTeamService, OrganizationService, RoleService) {
        function init() {
            $scope.linkingActivities = [];
            $scope.types = [{ "name": "Action", "value": "action" },
            { "name": "Decision", "value": "decision" },
            { "name": "Information", "value": "information" },
            { "name": "Other", "value": "other" }];
            $scope.outcomesQuantity = 0;
            $scope.user = Query.getCookie('user');
            $scope.date = new Date();
            $scope.date.setHours(0,0,0,0);

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
            
            $scope.activity = activity;

            $scope.outcomes = $scope.activity.outcomes;
            if($scope.outcomes){
                $scope.outcomesQuantity = $scope.outcomes.length;
            }
            delete $scope.activity.outcomes;
            $scope.tasks = tasks

            DepartmentService.getAll($scope.user.userAccountId).then(function(response){
                 $scope.departments = response.data;
             },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
             });
            // $http.get("/settings/departments/all?userAccountId=" + $scope.user.userAccountId).then(function (response) {
               
            // });

            $http.get("/users/list").then(function(res){
                $scope.users = res.data;
            });

            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function (response) {
                
            // });
            IncidentTeamService.all().then(function(response){
                $scope.teams = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-teams/all").then(function (response) {
                
            // });
            ActivityService.notDecisions($scope.user.userAccountId).then(function(response){
                $scope.linkingActivities = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/activities/not-decisions?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                
            // });


        };
        init();

        $scope.validActivityType = function () {
            if ($scope.activity) {
                return $scope.activity.type == "decision" ? true : false;
            }
        };

        $scope.quickAddUser = function() {
            console.log('comes here')
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

        $scope.addOrg = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/organization.template.html",
                controller: "OrganizationCreateCtrl",
                inputs: {
                    classes: $scope.classes,
                    report: $scope.status_report
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

        $scope.addOutcome = function () {

            if (!$scope.activity.possible_outcomes) {
                $scope.activity.possible_outcomes = 0;
            }

            if ($scope.outcomesQuantity && $scope.outcomesQuantity === 4) {
                toastr.error('Cannot add more than 4 outcomes.');
            } else {
                var out = function (name, action) {
                    this.name = name;
                    this.outcome_activity_id = action;
                }
                $scope.outcomes.push(new out("", ""));
                $scope.outcomesQuantity = parseInt($scope.outcomesQuantity) + 1;
            }
        };

        var validateActivity = function () {
            if ($scope.activity.type === "decision" && $scope.outcomesQuantity > 0) {
                var valid = true;
                angular.forEach($scope.outcomes, function (outcome, key) {
                    if (outcome.name === "" || outcome.action === "") {
                        toastr.error('Outcome must not be left blank.');
                        valid = false;
                    }
                });
                return valid === true ? true : false;
            }else if($scope.activity.type === "decision" && $scope.outcomesQuantity === 0){
                toastr.error('Add at least one outcome.', 'Error!');
                return false;
            }

            return true;
        };

        $scope.update = function () {
            if (validateActivity()) {
                var data = { activity: $scope.activity, outcomes: $scope.outcomes };
                ActivityService.update(data).then(function(response){
                    toastr.success("Activity updated successfully");
                    $scope.close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/update', { data: data })
                // .then(function (response) {
                    
                // });
            };
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
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
