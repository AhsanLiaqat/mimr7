(function () {
    'use strict';

    angular.module('app')
        .controller('linkActivityModalCtrl', ['$scope', '$rootScope', 'ModalService', 'close', '$routeParams','$http',
                                              'AuthService','$location','$timeout', '$filter',
                                              'userAccountId', 'actionPlanId', 'defaultSectionID', 'filterFilter','Query','ActivityService','RoleService','TagService','TaskService','ActionPlanService','PlanActivityService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, $rootScope, ModalService, close, $routeParams, $http,
                          AuthService, $location, $timeout, $filter,
                          userAccountId, actionPlanId, defaultSectionID, filterFilter,Query,ActivityService, RoleService, TagService, TaskService, ActionPlanService,PlanActivityService, SectionService) {


        function activityObj(reslevel, possible_outcomes, description, type) {
            this.responsibility_level = reslevel,
            this.possible_outcomes = possible_outcomes,
            this.description = description;
            this.type = type;
            this.userAccountId = userAccountId
        }


        function init() {
            $scope.searchKeywords = '';
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.filteredActivities = [];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];
            $scope.user = Query.getCookie('user');

            $scope.maxIndex = false;
            $scope.activity = new activityObj('', 0, '', "action");
            $scope.page1 = true;
            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
                $scope.tags.unshift({id: 0, text: 'All Tags'});
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
            // });

            if(defaultSectionID){
              $scope.defaultSectionID = defaultSectionID
            }else{
                SectionService.createDefault({actionPlanId: actionPlanId}).then(function(sec){
                    $scope.defaultSectionID = sec.data.id;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
              // $http.post('/sections/create-default', {actionPlanId: actionPlanId}).then(function(sec){
                
              // })
            }
            ActivityService.all(userAccountId).then(function(response){
                $scope.activities = response.data;
                angular.forEach($scope.activities, function (activity) {
                    activity.responsibility_level = (activity.responsibility_level == null || activity.responsibility_level == undefined)? '' : activity.responsibility_level;
                });
                console.log('-----as-da-sd-asd-as-da-sd---------',$scope.activities)
                $scope.activities = $filter('orderBy')($scope.activities, 'task_list.title');
                $scope.activities = filterFilter($scope.activities, { 'task_list': {} });
                PlanActivityService.getActivities(actionPlanId).then(function(response){
                    $scope.planActivities = response.data;
                        if ($scope.planActivities.length > 0) {
                            $scope.maxIndex = _.max($scope.planActivities, function (activity) { return activity.index; });

                            var activities = [];
                            angular.forEach($scope.activities, function (activity) {
                                activity.responsibility_level = (activity.responsibility_level == null || activity.responsibility_level == undefined)? '' : activity.responsibility_level;
                                var filteredActivity = filterFilter($scope.planActivities, {'activityId': activity.id});
                                filteredActivity.length === 0 ? activities.push(activity) : '';
                            });
                            $scope.activities = activities;
                            $scope.activities = $filter('orderBy')($scope.activities, 'task_list.title');
                        }
                        $scope.search();
                        $scope.select($scope.currentPage);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/plan-activities/get-activities?actionPlanId=" + actionPlanId)
                //     .then(function (response) {
                        
                //     });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/activities/all?userAccountId="+userAccountId)
            // .then(function (response) {
                
            // });
        };
        init();

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageActivities = $scope.filteredActivities.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredActivities = $filter('filter')($scope.activities, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredActivities = $filter('orderBy')($scope.activities, rowName);
            console.log('--------------',rowName,'++',$scope.filteredActivities);
            return $scope.onOrderChange();
        };

        $scope.displayActivityActor = function (activity) {
            return (activity.response_actor === null ? 'N/A' : activity.response_actor.firstName + " " + activity.response_actor.lastName);
        };

        $scope.save = function () {
            console.log("default section ID", $scope.defaultSectionID);
            var selectedActivities = filterFilter($scope.activities, { 'selected': true });
            if (selectedActivities.length > 0) {
                var nextIndex = $scope.maxIndex ? $scope.maxIndex.index + 1 : 0;
                var tasks = [];
                angular.forEach(selectedActivities, function (activitySelected, index) {
                    var data = { activitySelected: activitySelected.id, actionPlanId: actionPlanId, nextIndex: nextIndex, sectionId: $scope.defaultSectionID };
                    ActionPlanService.assignActivity(data).then(function(response){
                        response.data = response.data.activity;
                        response.data.title = response.data.task_list.title;
                        response.data.response_actor_email = response.data.response_actor ? response.data.response_actor.email : null;
                        response.data.backup_actor_email = response.data.backup_actor ? response.data.backup_actor.email : null;
                        response.data.accountable_actor_email = response.data.accountable_actor ? response.data.accountable_actor.email : null;
                        response.data.index = nextIndex;
                        tasks.push(response.data);
                        if ( (selectedActivities.length - index) === 1) {
                                toastr.success('Task/s have been assigned', 'Success');
                                close(tasks);
                        }
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/action-plans/assign-activity', { data: data })
                    //     .then(function (response) {
                            
                    // });
                    nextIndex = nextIndex + 1;
                });
            } else {
                toastr.error('Please select at least one assigned task', 'Error');
            }
        };

        $scope.addTask = function () {
            $scope.page1 = false;
            $scope.page2 = true;

            if (!$scope.tasks){
                TaskService.all(userAccountId).then(function(response){
                    $scope.tasks = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/tasks/all?userAccountId=' + userAccountId).then(function (response) {
                    
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

                $http.get("/users/list").then(function (res) {
                    $scope.users = res.data;
                });
            }
        };

        $scope.addTaskItem = function () {
            ModalService.showModal({
                templateUrl: "views/action.item.create.html",
                controller: "AddActionItemCtrl",
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '')
                    $scope.tasks.unshift(result);
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

        var validateActivity = function () {
            if (!$scope.activity.taskListId) {
                toastr.error('Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.createAssignTask = function () {
            if (validateActivity()) {
                $scope.activity.outcomes = [];
                var data = { activity: $scope.activity };
                ActivityService.create(data).then(function(response){
                    toastr.success("Task created", 'Success!');
                    $scope.activities.unshift(response.data);
                    $scope.page1 = true;
                    $scope.page2 = false;
                    $scope.search();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/create', { data: data }).then(function (response) {
                    
                // });
            };
        };

        $scope.back = function () {
            $scope.page1 = true;
            $scope.page2 = false;
        };

        $scope.CategoryFilter = function () {
            if ($scope.categoriesFilter && $scope.categoriesFilter === 'All Categories') {
                $scope.categoriesFilter = null;
            }
            $scope.filteredActivities = $filter('filter')($scope.activities, $scope.categoriesFilter);
            return $scope.onFilterChange();
        };

        $scope.close = function (params) {
        params = (params == null || params == undefined)?'': params;
        close(params);
        };
    }
} ());
