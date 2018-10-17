(function () {
    'use strict';

    angular.module('app')
        .controller('createActionPlanCtrl', ['$scope', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','Query','DepartmentService','ActivityService','IncidentTypeService','OrganizationService','ScenarioService','RoleService','TaskService','ActionPlanService','DecisionService','PlanActivityService', ctrlFunction]);

    function ctrlFunction($scope, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter,Query,DepartmentService,ActivityService, IncidentTypeService, OrganizationService, ScenarioService, RoleService, TaskService, ActionPlanService, DecisionService, PlanActivityService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            console.log($scope.scenarioOptionsAll);
            angular.forEach($scope.scenarioOptionsAll, function (elem) {
                if(elem.category == null || elem.category.id == id){
                    $scope.scenarioOptions.push(elem);
                }
            });
        }
        var sortList = function () {
            $scope.activities = _.sortBy($scope.activities, function (activity) { return activity.index; });
        };

        function setDateFormat(planDate) {
            return moment.utc(planDate).format('DD/MM/YYYY');
        }

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.scenarioOptions = [];
            ScenarioService.list($scope.user.userAccountId).then(function(response){
                $scope.scenarioOptions = response.data;
                $scope.scenarioOptionsAll = angular.copy($scope.scenarioOptions)
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/scenarios/list?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            $scope.action = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            IncidentTypeService.list().then(function(res){
                $scope.categories = res.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-types/list").then(function (res) {
                
            // });

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
            // $http.get("/settings/departments/all?userAccountId=" + $scope.user.userAccountId).then(function (response) {
            //     $scope.departments = response.data;
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

            if ($routeParams.id !== undefined) {
                $scope.planId = $routeParams.id;
                ActionPlanService.get($scope.planId).then(function(response){
                    $scope.data = response.data;
                    if ($scope.data) {
                        $scope.data.plandate = $scope.data.plandate ? setDateFormat($scope.data.plandate) : false;
                    }
                    ActionPlanService.activities($scope.data.id).then(function(response){
                        $scope.activities = response.data;
                        sortList();
                        ActivityService.notDecisions($scope.user.userAccountId).then(function(response){
                            $scope.outcomes = response.data;
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get("/settings/activities/notDecisions?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                            
                        // });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/action-plans/activities?actionPlanId=" + $scope.data.id).then(function (response) {
                        
                    // });
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/settings/action-plans/get?id=' + $scope.planId;
                // $http.get(path).then(function (response) {
                    
                // });
            }
        };

        init();

        $scope.addActivity = function () {
            ModalService.showModal({
                templateUrl: "views/incidents/link-activity-modal.html",
                controller: "linkActivityModalCtrl",
                inputs: {
                    userAccountId: $scope.user.userAccountId,
                    actionPlanId: $scope.data.id,
                    defaultSectionID: null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');

                    if (result !== '' && typeof result !== 'undefined') {
                        angular.forEach(result, function (task) {
                            $scope.activities.push(task);
                        });
                        sortList();
                    }
                });
            });
        };
        $scope.addIncidentType = function(){
            ModalService.showModal({
                templateUrl: "views/wizard/incident-type-template.html",
                controller: "incidentTypeAddCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.save = function (data, exit) {
            if(data && data.name != null){
                $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                if (data.id === undefined) {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    ActionPlanService.save(data).then(function(response){
                        $scope.data = response.data;
                        if (exit === true) {
                            $location.path('settings/action-plans');
                        }
                        else {
                            var path = '/settings/action-plans/create/' + $scope.data.id + '/step-two';
                            $location.path(path);
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/save', { data: data }).then(function (response) {
                        

                    // });
                } else {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    data.isComplete = true;
                    ActionPlanService.update(data).then(function(response){
                        if (exit === true) {
                            $location.path('/settings/action-plans');
                        }
                        else {
                            var path = '/settings/action-plans/create/' + data.id + '/step-two';
                            $location.path(path);
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/update', { data: data }).then(function (response) {
                        
                    // });
                }
            }else{
            toastr.error("Please fill the required field");
        }
        };

        $scope.update = function () {
            if ($scope.decision) {
                $scope.decision.actionPlanId = $scope.data.id;
                DecisionService.bulkSave($scope.decision).then(function(response){
                    toastr.success("Saved successfully.");
                    var path = 'settings/action-plans/create/' + $scope.data.id;
                    $location.path('settings/action-plans');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/decisions/bulkSave', { data: $scope.decision }).then(function (response) {
                    
                // });
            };
        };

        $scope.updateActivity = function (activity) {
            var data = { activityId: activity.id, planId: $scope.data.id, defaultActivity: activity.default }
            PlanActivityService.updateDefault(data).then(function(response){
                toastr.success("Activity updated successfully.");
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/plan-activities/update-default', data).then(function (response) {
                
            // });
        };

        var updateActivityIndex = function () {
            angular.forEach($scope.activities, function (activity, index) {
                activity.index = index;
                var data = { activityId: activity.id, planId: $scope.data.id, index: activity.index };
                PlanActivityService.updateIndex(data).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/plan-activities/update-index", data).then(function (response) {
                // });
            });
        }

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

        $scope.deleteActivity = function (activity, index) {
            var data = { activityId: activity.id, planId: $scope.data.id };
            console.log(data);
            PlanActivityService.removeActivity(data).then(function(response){
                $scope.activities.splice(index, 1);
                toastr.success('activity deleted', 'Success');
                updateActivityIndex();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/plan-activities/remove-activity", data)
            //     .then(function (response) {
                    
            //     });
        };
        $scope.saveExit = function(){
            $location.path('/settings/action-plans');
        };

        $scope.DragOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                updateActivityIndex();
                sortList();
            },
            itemMoved: function (event) {
                console.log('item moved');
            },
            dragStart: function (event) { console.log('drag started') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        $scope.addTaskItem = function () {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== ''){
                        $scope.tasks.unshift(result);
                    }
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
    }
}());
