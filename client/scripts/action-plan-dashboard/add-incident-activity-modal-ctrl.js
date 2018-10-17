(function () {
    'use strict';

    angular.module('app')
    .controller('addIncidentActivityModalCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    'ModalService',
    'filterFilter',
    '$location',
    '$timeout',
    '$filter',
    'incident_id',
    'incident_plan_id',
    'action_plan_id',
    'Query',
    'DepartmentService',
    'ActivityService',
    'IncidentTeamService',
    'OrganizationService',
    'RoleService',
    'TaskService',
    'IncidentActivityService',
    ctrlFunction]);

    function ctrlFunction($scope,$rootScope,close,$routeParams,$http,AuthService,ModalService,filterFilter,$location,$timeout,$filter,incident_id,incident_plan_id,action_plan_id,Query,DepartmentService,ActivityService, IncidentTeamService, OrganizationService, RoleService, TaskService, IncidentActivityService) {
        function activityObj(reslevel, description, type) {
            this.responsibility_level = reslevel;
            this.description = description;
            this.type = type;
            this.userAccountId = $scope.user.userAccountId;
        }

        function init() {
            $scope.outcomesQuantity = 0;
            $scope.user = Query.getCookie('user');
            
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
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/roles/all").then(function(response) {
                
            // });

            $scope.additionalInfo = false;
            $scope.types = [{ "name": "Action", "value": "action" },
            { "name": "Decision", "value": "decision" },
            { "name": "Information", "value": "information" },
            { "name": "Other", "value": "other" }];
            $scope.linkingActivities = [];

            $scope.activity = new activityObj('', '', "action");
            IncidentTeamService.all().then(function(response){
                $scope.teams = response.data;
                $scope.teams.push({ "name": "All Users", "id": 1 })
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-teams/all").then(function (response) {
                
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

            $http.get("/users/list").then(function (res) {
                $scope.users = res.data;
            });
        };
        init();

        $scope.validActivityType = function () {
            return $scope.activity.type == "decision" ? true : false;
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
                    incident: $scope.incident,
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
            if (!$scope.outcomes) {
                $scope.outcomes = [];
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
                        toastr.error('Outcome must not be left blank.', 'Error!');
                        valid = false;
                    }
                });
                return valid === true ? true : false;
            } else if ($scope.activity.type === "decision" && $scope.outcomesQuantity === 0) {
                toastr.error('Add at least one outcome.', 'Error!');
                return false;
            }

            if (!$scope.activity.type) {
                toastr.error('Activity Type is not selected.', 'Error!');
                return false;
            }

            if (!$scope.activity.taskListId) {
                toastr.error('Activity Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.save = function () {
            if (validateActivity()) {
                $scope.activity.name = filterFilter($scope.tasks, { 'id': $scope.activity.taskListId })[0].title;
                $scope.activity.default = true;
                $scope.activity.copy = false;
                $scope.activity.activated = false;
                $scope.activity.status = "incomplete";
                $scope.activity.index = -1;
                $scope.activity.incident_plan_id = incident_plan_id;
                $scope.activity.action_plan_id = action_plan_id;
                $scope.activity.incident_id = incident_id;
                var data = { activity: $scope.activity, outcomes: $scope.outcomes };
                IncidentActivityService.create(data).then(function(response){
                    toastr.success("Activity created", "Success!");
                    $scope.close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/incident-activities/create', { data: data })
                // .then(function (response) {
                    
                // });
            };
        };

        $scope.setTeam = function () {
            var selectedTeam = $filter('filter')($scope.teams, { id: $scope.incidentsTeamId });
            if ($scope.incidentsTeamId && selectedTeam && selectedTeam.length > 0) {
                $scope.selectedTeam = selectedTeam[0].users;
            }
        };

        $scope.validateActivityUniqueness = function (activity_task) {
            var matched = $filter('filter')($scope.activity_tasks, { taskListId: activity_task.taskListId });
            if (matched.length > 1) {
                activity_task.taskListId = null;
                toastr.error('This task has already been selected.');
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
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
