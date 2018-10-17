(function () {
    'use strict';

    angular.module('app')
        .controller('editActionPlanModalCtrl', ['$scope', 'close', '$routeParams', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter', 'planId','Query','DepartmentService','AllCategoryService','ActivityService','IncidentTypeService','OrganizationService','ScenarioService','RoleService','TagService','TaskService','ActionPlanService','DecisionService','PlanActivityService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $filter, AuthService, $location, ModalService, filterFilter, planId,Query, DepartmentService, AllCategoryService,ActivityService, IncidentTypeService, OrganizationService, ScenarioService, RoleService, TagService, TaskService, ActionPlanService, DecisionService, PlanActivityService, SectionService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            angular.forEach($scope.scenarioOptionsAll, function (elem) {
                if(elem.category == null || elem.category.id == id){
                    $scope.scenarioOptions.push(elem);
                }
            });
        }
        var sortList = function () {
            $scope.activities = _.sortBy($scope.activities, function (activity) { return activity.index; });
        };

        function init() {
            $scope.user = Query.getCookie('user');;
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
            $scope.searchKeywords = ''
            $scope.currentPage = 1;
            $scope.numPerPageOpt = [3, 5, 10, 20];
            $scope.ActivityName = "Activities";
            $scope.ActivityPosition = 100;
            $scope.filteredActivities = [];
            $scope.row = '';
            $scope.numPerPage = $scope.numPerPageOpt[1];
            $scope.page1 = true;
            $scope.sectionRec = true;
            $scope.action = [];
            $scope.typeOptions = [];
            $scope.expand = false;
            $scope.activityExpand = false;
            $scope.activities = [];
            
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

            ActionPlanService.get(planId).then(function(response){
                $scope.data = response.data;
                $scope.data.plandate = $filter('date')($scope.data.plandate ,"dd/MM/yyyy");
                ActionPlanService.activities($scope.data.id).then(function(response){
                    $scope.activities = response.data;
                    console.log("activities ===>", $scope.activities);
                    sortList();
                    ActivityService.all($scope.user.userAccountId).then(function(response){
                        $scope.sections = [];
                        $scope.allActivities = response.data;
                        $scope.allActivities = $filter('orderBy')($scope.allActivities, 'task_list.title');
                        angular.forEach($scope.allActivities, function(activity){
                          var filteredActivity = filterFilter($scope.activities, {'id': activity.id} )[0];
                          activity.selected = filteredActivity ? true : false;
                        });
                        $scope.search();
                        $scope.select($scope.currentPage);
                        ActionPlanService.sections(planId).then(function(response){
                            $scope.sections = response.data;
                            $scope.sectionRec = false;
                            $scope.defaultSection = filterFilter($scope.sections, {'default': true} )[0];
                            if($scope.defaultSection ){
                                angular.forEach($scope.sections, function(section){
                                    var arr = [];
                                    angular.forEach(section.activities, function(id){
                                        arr.push(filterFilter($scope.allActivities, {'id': id} )[0]);
                                    });
                                    section.activities = angular.copy(arr);
                                });

                            }else{
                                SectionService.createDefault({actionPlanId: $scope.data.id}).then(function(sec){
                                    $scope.sections.push(sec.data);
                                    angular.forEach($scope.sections, function(section){
                                        var arr = [];
                                        angular.forEach(section.activities, function(id){
                                            arr.push(filterFilter($scope.allActivities, {'id': id} )[0]);
                                        });
                                        section.activities = angular.copy(arr);
                                    });
                                    $scope.defaultSection = filterFilter($scope.sections, {'default': true} )[0];
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post('/sections/create-default', {actionPlanId: $scope.data.id}).then(function(sec){
                                    
                                // });
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get('/settings/action-plans/'+planId+'/sections').then(function (response) {
                            
                        // });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.get("/settings/activities/all?userAccountId=" + $scope.user.userAccountId)
                    // .then(function (response) {
                        
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
            // $http.get('/settings/action-plans/get?id=' + planId).then(function (response) {
                
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
            AllCategoryService.list().then(function(res){
                $scope.allCategories = res.data;
                $scope.allCategories=_.sortBy($scope.allCategories,function(o){return new Date(o.position);});
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/all-categories/list").then(function (res) {
                
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

            TagService.getAccountTags($scope.user.userAccountId).then(function(response){
                $scope.tags = response.data;
                $scope.tags.unshift({id: 0, text: 'All Categories'});
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/tags/get-account-tags?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                
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
            $scope.filteredActivities = $filter('filter')($scope.allActivities, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredActivities = $filter('orderBy')($scope.allActivities, rowName);
            return $scope.onOrderChange();
        };
        $scope.newAssignTask = function () {
            $scope.act = {};
            $scope.page5 = false;
            $scope.page10 = true;
        };

        $scope.activeTabs = function(val){
            if(val == 'task'){
                $scope.activeTabEditModal = true;
                $scope.activeTabEditModal1 = false;
            }else{
                $scope.activeTabEditModal = false;
                $scope.activeTabEditModal1 = true;
            }

        }
        $scope.addModal = function() {
            $scope.act = {};
            ModalService.showModal({
                templateUrl: "views/settings/task-libraries/form.html",
                controller: "addTaskCtrl",
                inputs: {
                    taskAssign: false
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result){
                        $scope.taski = result.data;
                        $scope.act.outcomes = [];
                        $scope.act.taskListId = $scope.taski.id;
                        $scope.act.categoryId = $scope.taski.categoryId;
                        $scope.act.description = $scope.taski.description;
                        var data = { activity: $scope.act };
                        ActivityService.save(data).then(function(response){
                            toastr.success("Task created", 'Success!');
                            var data = { activitySelected: response.data.id, actionPlanId: $scope.data.id, nextIndex: 0, sectionId: $scope.defaultSection.id };
                            ActionPlanService.assignActivity(data).then(function(response){
                                response.data = response.data.activity;
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            if(response.data.task_list){
                                response.data.title = response.data.task_list.title;
                                response.data.for_template = response.data.task_list.for_template;
                            }
                            $scope.activities.push(response.data);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                });
            });
        };
        $scope.addActivity = function () {
            ModalService.showModal({
                templateUrl: "views/incidents/link-activity-modal.html",
                controller: "linkActivityModalCtrl",
                inputs: {
                    userAccountId: $scope.user.userAccountId,
                    actionPlanId: $scope.data.id,
                    defaultSectionID: $scope.defaultSection.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result !== '' && typeof result !== 'undefined') {
                        console.log("result ====>",result);
                        $scope.activities = $scope.activities.concat(result);
                        var ind = $scope.sections.indexOf($scope.defaultSection);
                        $scope.sections[ind].activities = $scope.sections[ind].activities.concat(result);
                        console.log($scope.activities);
                        sortList();
                    }
                });
            });
        };

        $scope.addIncidentType = function () {
            ModalService.showModal({
                templateUrl: "views/wizard/incident-type-template.html",
                controller: "incidentTypeAddCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.save = function (data, exit) {
            $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';

            if ($scope.data.name != null && data.plandate != null) {
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
                // $scope.page3 = true;
                $scope.addSections();
            } else {
                toastr.error("Please Fill Required Fields");
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
        $scope.closePicker = function () {
            $('.datepicker').hide();
        };

        $scope.updateActivity = function (activity) {
            var data = { activityId: activity.id, planId: $scope.data.id, defaultActivity: activity.default };
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
                    var data = { activities: $scope.activities, planId: $scope.data.id };
                    $http.post("/incidentPlan/updateIndex", data).then(function (response) {
                    });
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
          var ind = $scope.activities.indexOf(activity);
          $scope.activities.splice(ind, 1);
          var data = { activityId: activity.id, planId: $scope.data.id };
          PlanActivityService.removeActivity(data).then(function(response){
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
        $scope.deleteActivitySection = function (activity, index, section) {
            var sectionIdx = $scope.sections.indexOf(section);
            var ind1 = $scope.sections[sectionIdx].plan_activities.indexOf(activity);
            $scope.sections[sectionIdx].plan_activities.splice(ind1, 1);
            if(section.default){
                $http.post("/plan_activities/update", {id: activity.id, isDeleted: true}).then(function(){
                    toastr.success('Activity deleted', 'Success');
                })
            }else{
                var sectionIdx2 = $scope.sections.indexOf($scope.defaultSection);
                $scope.sections[sectionIdx2].plan_activities.push(activity);
                console.log($scope.sections);
                var data = {};
                data.defaultId = $scope.defaultSection.id;
                data.activityId = activity.id;
                data.actionPlanId = $scope.data.id;
                SectionService.moveToDefaultSection(data).then(function(){
                    toastr.success('Activity moved to default Section: '+ section.name, 'Success');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/sections/move-to-default-section", {data: data}).then(function(){
                    
                // })

            }
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

        $scope.saveExit = function () {
            close($scope.data);
        };
        $scope.deleteSection = function(secId,ind){
            // var section = filterFilter($scope.allCategories, { 'selected': true });
            angular.forEach($scope.sections, function (section, index) {
                if(section.id == secId){
                    SectionService.delete(secId).then(function(result){
                        $scope.sections.splice(ind,1);
                        toastr.success('Section Deleted', 'Success!');
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.delete("/sections/delete/" + secId)
                    // .then(function (result) {

                    // }, function (error) {
                    //     toastr.error(error, 'Error!');
                    // })
                }
            });

        }
        $scope.setSectionIndex =  function(){
            angular.forEach($scope.sections, function (sec, index) {
                angular.forEach(sec.activities, function (activity, ind) {
                var data = { activitySelected: activity.id, actionPlanId: $scope.data.id, nextIndex: ind, sectionId: sec.id };
                ActionPlanService.assignActivitySection(data).then(function(response){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/action-plans/assign-activity-section', { data: data })
                //     .then(function (response) {

                //       });
                 });
             });
        };

        $scope.DragOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id; },
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
        $scope.DragOptions1 = {
            accept: function (sourceItemHandleScope, destSortableScope) { return true; },
            orderChanged: function (event) {
                console.log('sad');
                $scope.setSectionIndex();
            },
            itemMoved: function (event) {
                var activity = event.source.itemScope.activity;
                var sectionId = event.dest.sortableScope.element[0].id
                console.log('----------->>>/---',activity,sectionId,event.dest);
                if (sectionId) {
                    var object ={id : activity.id, sectionId: sectionId};
                    PlanActivityService.update(object).then(function(res){
                        var section = $scope.sections.find(function (cl) {
                            return cl.id == sectionId;
                        });
                        angular.forEach(section.plan_activities, function(obj, ind) {
                            var object ={id : obj.id, tindex: ind};
                            obj.tindex = ind;
                            PlanActivityService.update(object).then(function(res){

                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {
                            // });
                        });
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/plan-activities/update', object ).then(function (res) {
                        
                    // });
                }
                // event.preventDefault();
                console.log('item moved');
            },
            dragStart: function (event) { console.log('drag startedsamdnm,n,') },
            dragEnd: function (event) { console.log('drag ended') }
        };

        $scope.backToAllActivities = function () {
            $scope.page3 = true;
            $scope.page4 = false;
            $scope.page5 = false;
        };

        $scope.newAssignTask = function () {
            $scope.page5 = false;
            $scope.page10 = true;
        };

        $scope.addSections = function () {
            var found = false;
            $scope.page5 = true;
        };


        $scope.editActivities = function(){
            $scope.page5 = false;
            $scope.page9 = true;
        }
        $scope.updateActivities = function(){
            $scope.page9 = false;
            $scope.page5 = true;
        }
        var validateActivity = function () {
            if (!$scope.act.taskListId) {
                toastr.error('Activity Task is not selected.', 'Error!');
                return false;
            }
            return true;
        };

        $scope.createAssignTask = function () {
            if (validateActivity()) {
                $scope.act.outcomes = [];
                var data = { activity: $scope.act };
                ActivityService.save(data).then(function(response){
                    toastr.success("Assign Task created", 'Success!');
                    $scope.selActivities.push(response.data);
                    $scope.selActivities = $filter('orderBy')($scope.selActivities, 'task_list.title');
                    $scope.search();
                    $scope.select($scope.currentPage);
                    $scope.page5 = true;
                    $scope.page10 = false;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/activities/save', { data: data }).then(function (response) {
                    
                // });
            };
        };

        $scope.backToSections = function() {
          if($scope.page6 == true){
            $scope.page6 = false;
          }
          if($scope.page7 == true){
            $scope.page7 = false;
          }

          // if($scope.page8 == true){
          //   $scope.page8 = false;
          // }
          if($scope.page10 == true){
            $scope.page10 = false;
          }
          $scope.page5 = true;
        };
        $scope.updateSection = function() {
          if ($scope.sectionName === ''){
            toastr.error('Please provide section name');
          } else {
            SectionService.updateForEdit({index: $scope.position,id: $scope.editedsection.id, name: $scope.sectionName, actionPlanId: $scope.data.id}).then(function(response){
                angular.forEach($scope.concatinate, function(task, index){
                    var ind = $scope.tsks.indexOf(task);
                    if(ind == -1){
                        var indx = $scope.editedsection.plan_activities.indexOf(task);
                        if(indx != -1){
                            var object ={id : task.id, sectionId: $scope.defaultSection.id};
                            PlanActivityService.update(object).then(function(res){
                                console.log('from edit to dfault',index);
                                $scope.editedsection.plan_activities.splice(indx,1);
                                $scope.defaultSection.plan_activities.push(task);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {

                            // });
                        }
                    }else{
                        var indx = $scope.editedsection.plan_activities.indexOf(task);
                        if(indx == -1){
                            var object ={id : task.id, sectionId: $scope.editedsection.id};
                            PlanActivityService.update(object).then(function(res){
                                var indxx = $scope.defaultSection.plan_activities.indexOf(task);
                                $scope.defaultSection.plan_activities.splice(indxx,1);
                                console.log('from default to edit',index);
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // $http.post('/plan-activities/update', object ).then(function (res) {
                                
                            //         // $scope.editedsection.plan_activities.push(task);
                            // });
                        }
                    }
                });
                var ii = $scope.sections.indexOf($scope.editedsection);
                $scope.sections[ii] = response.data;
                $scope.sections[ii].plan_activities = angular.copy($scope.tsks);
                $scope.sections[ii].addActivities = false;
                $scope.sections = _.sortBy($scope.sections, function (activity) { return activity.index; });
                toastr.success('Section Updated','Success');
                $scope.page7 = false;
                $scope.page5 = true;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/update-for-edit', {index: $scope.position,id: $scope.editedsection.id, name: $scope.sectionName, actionPlanId: $scope.data.id}).then(function (response) {
                
            // });
          }
        };
        $scope.editSection = function (sec,ind){
          $scope.sec_heading = "Edit Section";
          $scope.sectionName = sec.name;
          $scope.position = sec.index;
          $scope.page5 = false;
          $scope.page7 = true;
          $scope.editedsection = sec;
          $scope.concatinate = [];
          $scope.sel = [];
          angular.forEach(sec.plan_activities, function(act){
            $scope.concatinate.push(act);
            $scope.sel.push(true);
          });
          $scope.tsks = angular.copy($scope.concatinate);
          var ind = $scope.sections.indexOf($scope.defaultSection);
          $scope.selActivities = $scope.sections[ind].plan_activities;
          angular.forEach($scope.selActivities, function(s){
            $scope.concatinate.push(s);
            $scope.sel.push(false);
          });
        };

        $scope.addinsection = function(activity,select,sec){
            if(select){
                $scope.tsks.push(activity);
            }else{
                angular.forEach($scope.tsks, function(task,ind){
                    if(task.id == activity.id){
                        $scope.tsks.splice(ind,1);
                    }
                });
            }
        }
        $scope.newSection = function (){
            $scope.sec_heading = "Add New Section";
            $scope.sectionName = '';
            $scope.position = 99;
            $scope.page5 = false;
            $scope.page6 = true;
            $scope.sel = [];
            var ind = $scope.sections.indexOf($scope.defaultSection);
            $scope.selActivities = $scope.sections[ind].plan_activities;
            angular.forEach($scope.selActivities, function(activity){
                $scope.sel.push(false);
            });
            $scope.tsks = [];
        };
        $scope.createNewSection = function() {
          if ($scope.sectionName === ''){
            toastr.error('Please provide section name');
          } else {
            SectionService.create({index: $scope.position,name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks}).then(function(response){
                $scope.sections.unshift(response.data);
                $scope.sections[0].addActivities = false;
                $scope.sections[0].plan_activities = angular.copy($scope.tsks);
                $scope.sections = _.sortBy($scope.sections, function (activity) { return activity.index; });
                angular.forEach($scope.tsks, function(task, index){
                    var ind = $scope.selActivities.indexOf(task);
                    $scope.selActivities.splice(ind, 1);
                });
                toastr.success('Section Created','Success');
                $scope.page6 = false;
                $scope.page5 = true;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/create', {index: $scope.position,name: $scope.sectionName, actionPlanId: $scope.data.id, activities: $scope.tsks}).then(function (response) {
                
            // });
          }
        };

        $scope.updateActionPlan = function() {
            ActionPlanService.update({id: $scope.data.id, isComplete: true}).then(function(response){

            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/settings/action-plans/update', { data: {id: $scope.data.id, isComplete: true} });
            toastr.success('Tasks have been assigned', 'Success');
            close($scope.data);
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

        $scope.displayActivityActor = function (activity) {
          if (activity) {
            return !activity.response_actor ? 'N/A' : activity.response_actor.firstName + " " + activity.response_actor.lastName;
          }
        };

        $scope.getSectionActivities = function (section) {
            var activities = [];
            angular.forEach(section.activities, function(sectionActivityId){
                var filteredActivity = filterFilter($scope.selectedActivitiesCopy, {'id': sectionActivityId});
                filteredActivity ? activities.push(filteredActivity[0]) : '';
            });
            return activities;
        };

        function activityObj(reslevel, possible_outcomes, description, type) {
            this.responsibility_level = reslevel,
            this.possible_outcomes = possible_outcomes,
            this.description = description;
            this.type = type;
            this.response_actor = null;
            this.userAccountId = $scope.user.userAccountId
        }

        $scope.activity = new activityObj('', 0, '', "action");

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

        $scope.CategoryFilter = function () {
            if ($scope.categoriesFilter && $scope.categoriesFilter === 'All Categories') {
                $scope.categoriesFilter = null;
            }
            $scope.filteredActivities = $filter('filter')($scope.allActivities, $scope.categoriesFilter);
            return $scope.onFilterChange();
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

    }
}());
