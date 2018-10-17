(function () {
    'use strict';

    angular.module('app')
        .controller('editActionPlanWizardModalCtrl', ['$scope','close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService','plan', 'filterFilter','Query','DepartmentService','ActivityService','IncidentTypeService','OrganizationService','RoleService','ActionPlanService','DecisionService','PlanActivityService', ctrlFunction]);

    function ctrlFunction($scope,close, $routeParams, $http, $filter, AuthService, $location, ModalService,plan, filterFilter,Query, DepartmentService,ActivityService, IncidentTypeService, OrganizationService, RoleService, ActionPlanService, DecisionService, PlanActivityService) {

        var sortList = function () {
            $scope.activities = _.sortBy($scope.activities, function (activity) { return activity.index; });
        };

        function init() {
            $scope.page1 = true;
            $scope.action = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.user = Query.getCookie('user');
            $scope.activities = [];
            $scope.scenarioOptions = [
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
                { value: 4, text: 4 },
                { value: 5, text: 5 },
                { value: 6, text: 6 },
                { value: 7, text: 7 },
                { value: 8, text: 8 },
                { value: 9, text: 9 },
                { value: 10, text: 10 }
            ];
            if(plan == null){
                $scope.data = {};
                var date = $filter('date')(new Date(),"dd/MM/yyyy");
                $scope.data.plandate = date;
            }

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

            $http.get('/tasks/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                $scope.tasks = response.data;
            });

            if (plan !== null) {
                $scope.planId = plan.id;
                $scope.plan = plan;
                ActionPlanService.get($scope.planId).then(function(response){
                    $scope.data = response.data;
                    $scope.data.plandate = $filter('date')($scope.data.plandate ,"dd/MM/yyyy");
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
                        // $http.get("/settings/activities/not-decisions?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                            
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
            if($scope.data.name != null && data.plandate != null){
                $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                if (data.id === undefined) {

                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    ActionPlanService.save(data).then(function(response){
                        $scope.data = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/save', { data: data }).then(function (response) {
                        
                    // });
                }
                else {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    ActionPlanService.update(data).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/update', { data: data }).then(function (response) {
                    // });
                }
                $scope.page1 = false;
                $scope.page2 = true;
            }else{
                toastr.error("Please Fill Required Fields");
            }
        };

        $scope.closePicker = function(date){
          $('.datepicker').hide();
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

        $scope.deleteActivity = function (activity, index) {
            var data = { activityId: activity.id, planId: $scope.data.id };
            PlanActivityService.removeActivity(data).then(function(response){
                $scope.activities.splice(1, index);
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
        $scope.saveExit = function (){
            close($scope.data);
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
