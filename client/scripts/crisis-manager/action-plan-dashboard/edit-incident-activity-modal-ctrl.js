(function () {
    'use strict';

    angular.module('app')
    .controller('editIncidentActivityModalCtrl', ['$scope',
    '$rootScope',
    'close',
    '$routeParams',
    '$http',
    'AuthService',
    'ModalService',
    '$location',
    '$timeout',
    '$filter',
    'filterFilter',
    'activityId',
    'Query',
    'DepartmentService',
    'ActivityService',
    'IncidentTeamService',
    'OrganizationService',
    'RoleService',
    'TaskService',
    'IncidentActivityService',
    ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        close,
        $routeParams,
        $http,
        AuthService,
        ModalService,
        $location,
        $timeout,
        $filter,
        filterFilter,
        activityId,
        Query,
        DepartmentService,
        ActivityService,
        IncidentTeamService,
        OrganizationService,
        RoleService,
        TaskService,
        IncidentActivityService) {

            function init() {
                IncidentActivityService.get(activityId).then(function(response){
                    $scope.activity = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/incident-activities/get?id="+activityId)
                // .then(function(response){
                    
                // });

                $scope.linkingActivities = [];
                $scope.types = [{ "name": "Action", "value": "action" },
                { "name": "Decision", "value": "decision" },
                { "name": "Information", "value": "information" },
                { "name": "Other", "value": "other" }];
                $scope.outcomesQuantity = 0;

                $scope.user = Query.getCookie('user');

                OrganizationService.all($scope.user.userAccountId).then(function(response){
                    $scope.organizations = response.data;
                    $scope.sortByCreate = _.sortBy($scope.organizations, function (o) { return new Date(o.createdAt); });
                    $scope.organizations = $scope.sortByCreate.reverse();
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
                    $scope.sortByCreate = _.sortBy($scope.departments, function (o) { return new Date(o.createdAt); });
                    $scope.departments = $scope.sortByCreate.reverse();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/departments/all?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                    
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

                $http.get("/users/list").then(function(res){
                    $scope.users = res.data;
                });
            };
            init();

            $scope.validActivityType = function () {
                if ($scope.activity) {
                    return $scope.activity.type == "decision" ? true : false;
                }
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
                }else if($scope.activity.response_time > $scope.activity.completion_time){
                    toastr.error('Please enter lesser Response time than Completion.', 'Error!');
                    return false;
                }

                return true;
            };

            $scope.update = function () {
                if (validateActivity()) {
                    $scope.activity.name = filterFilter($scope.tasks, { 'id': $scope.activity.taskListId })[0].title;
                    var data = { activity: $scope.activity, outcomes: $scope.outcomes };

                    IncidentActivityService.update(data).then(function(response){
                        toastr.success("Activity updated", 'Success!');
                        $scope.close(response.data);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/incident-activities/update', data)
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
