(function () {
    'use strict';

    angular.module('app.incidents')
    .controller('incidentsCtrl', ['$scope', '$filter', '$http', '$location', 'ModalService','Query','IncidentService', incidentsCtrl])
    .controller('incidentCtrl', ['$rootScope', '$scope', '$filter', '$http', '$timeout', '$location', '$routeParams', 'ModalService', 'filterFilter','close','IncidentId','DashboardCategoryService','CheckListService','IncidentTeamService','IncidentTypeService','ActionPlanService','IncidentPlanService','ClassService','IncidentService', incidentCtrl]);

    function incidentCtrl($rootScope, $scope, $filter, $http, $timeout, $location, $routeParams, ModalService, filterFilter,close,IncidentId,DashboardCategoryService, CheckListService, IncidentTeamService, IncidentTypeService, ActionPlanService, IncidentPlanService, ClassService, IncidentService) {

        $scope.data = {
            locations: [""]
        };

        $scope.activeNow = true;

        $scope.categories = [];

        function init() {
            $scope.selectedCategories = [];
            
            if (IncidentId !== undefined) {
                IncidentService.get(IncidentId).then(function(res){
                    $scope.edit = true;
                    $scope.data = res.data;
                    if($scope.data.incident_plans){
                        var filteredPlan = filterFilter($scope.data.incident_plans, { 'selected': true })[0];
                        $scope.selectedPlan = filteredPlan ? filteredPlan.actionPlanId : null;
                        $scope.originalPlan = angular.copy($scope.selectedPlan);
                    }

                    if ($scope.data && $scope.data.actionPlanId) {
                        IncidentPlanService.get($scope.data.actionPlanId,$scope.data.id).then(function(response){
                            $scope.incidentPlan = response.data;
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // var apiUrl = "/incident-plan/get?actionPlanId=" + $scope.data.actionPlanId + "&incidentId=" + $scope.data.id;
                        // $http.get(apiUrl).then(function (response) {
                            
                        // });
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = "/api/incidents/get?id=" + IncidentId;
                // $http.get(path).then(function (res) {
                    
                // });
            }else{
                $scope.new = true;
            }
            IncidentTeamService.typeAll().then(function(response){
                $scope.teams = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-teams/type-all?teamType=incident").then(function (response) {
                
            // });

            ActionPlanService.all().then(function(response){
                $scope.actions = filterFilter(response.data, { 'active': true });
                $scope.actions = _.sortBy($scope.actions, function (o) { return o.name.toLowerCase(); });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/action-plans/all').then(function (response) {
                
            // });
            IncidentTypeService.list().then(function(response){
                $scope.catcat = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/incident-types/list').then(function (response) {
                
            // });
        }
        init();

        var input = document.getElementById('locationInput');
        var inputs = document.getElementsByClassName("locations");

        $scope.categoryDataSource = new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
                read: {
                    url: "settings/incident-types/list",
                }
            }
        });

        $scope.remove = function (idx) {
            $scope.data.locations.splice(idx, 1);
        };

        $scope.addLocation = function () {
            $scope.data.locations.push("");
        };

        $scope.linkActionPlan = function (incidentID) {
            var planData = {
                actionPlanId: $scope.selectedPlan,
                incidentId: incidentID
            }
            if ($scope.originalPlan && $scope.originalPlan !== $scope.selectedPlan) {
                IncidentPlanService.checkCombinationPresence(planData).then(function(response){
                    if (response.data) {
                        IncidentPlanService.update(planData).then(function(response){
                            toastr.success('Incident updated.', 'Success!');
                            $location.path("/incidents/view");
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post("/incident-plan/update", planData)
                        // .then(function (response) {

                        // });
                    } else {
                        IncidentPlanService.save(planData).then(function(res){
                            if (res.data.outcomes.length > 0) {
                                IncidentPlanService.addOutcomes(res.data.outcomes).then(function(res){
                                    toastr.success('Incident updated.', 'Success!');
                                },function(err){
                                    if(err)
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                    else
                                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                                });
                                // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                                // .then(function (res) {
                                    
                                //     // $location.path("/incidents/view");
                                // })
                            } else {
                                toastr.success('Incident updated.', 'Success!');
                                // $location.path("/incidents/view");
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post("/incident-plan/save", planData)
                        // .then(function (res) {
                            
                        // });
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/incident-plan/check-combination-presence", planData)
                // .then(function (response) {
                    
                // });
            } else {
                IncidentPlanService.save(planData).then(function(res){
                    if (res.data.outcomes.length > 0) {
                        IncidentPlanService.addOutcomes(res.data.outcomes).then(function(res){
                            toastr.success('Incident created.', 'Success!');
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                        // .then(function (res) {
                            
                        //     // $location.path("/incidents/view");
                        // })
                    } else {
                        toastr.success('Incident created.', 'Success!');
                        // $location.path("/incidents/view");
                    }
                    close();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/incident-plan/save", planData)
                // .then(function (res) {
                    
                // });
            }
        };

        $scope.linkPlan = function () {
            $scope.link = true;
        };

        $scope.close = function() {
            close();
        }

        $scope.save = function () {
            if ($scope.data.id === undefined && $scope.data.name != null) {

                IncidentService.save($scope.data).then(function(response){

                    if ($scope.data.categoryId) {
                        createCategories(response.data);
                        // createCheckList(response.data);
                    }

                    if ($scope.link == true && $scope.selectedPlan) {
                        $scope.linkActionPlan(response.data.id);
                    } else {
                        toastr.success('Incident created.', 'Success!');
                        // $location.path("/incidents/view");
                    }
                    close(response);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/api/incidents/save", $scope.data)
                // .then(function (response) {

                // });

            } else {

                if ($scope.data.active == 'Closed') {
                    $scope.data.closed_time = new Date();
                }

                IncidentService.update($scope.data).then(function(response){
                    console.log("response", response);
                    console.log("data", $scope.data.categoryId);
                    if ($scope.data.categoryId) {
                        createCategoriesOnEdit($scope.data);
                    }
                    if ($scope.link == true && $scope.selectedPlan && $scope.selectedPlan !== $scope.originalPlan) {
                        $scope.linkActionPlan($scope.data.id);

                    } else {
                        toastr.success('Incident updated.', 'Success!');
                        // $location.path("/incidents/view");

                    }
                    close(response);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/api/incidents/update", { data: $scope.data }).then(function (response) {
                    
                // });
            }
        };

        function createCategories(inciData) {
            IncidentTypeService.item(inciData.categoryId).then(function(response){
                $scope.dcategories = response.data.default_categories;
                $scope.checkList = response.data.checkLists;
                console.log(" incident type data",response.data);

                for (var i = 0; i < $scope.checkList.length; i++) {
                    var checklistData = {}
                    checklistData.incidentId = inciData.id;
                    checklistData.checkListId = $scope.checkList[i].id;
                    checklistData.tasks = $scope.checkList[i].tasks;
                    CheckListService.saveIncidentCheckList(checklistData).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/settings/check-lists/save-incident-check-list', { data: checklistData }).then(function (response) {
                    // });
                }

                for (var i = 0; i < $scope.dcategories.length; i++) {
                    var data = {};
                    data.title = $scope.dcategories[i].name;
                    data.incidentId = inciData.id;
                    data.index = $scope.dcategories[i].position;
                    ClassService.savedCategories(data).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/class/saved-categories', { data: data }).then(function (response) {
                    // });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/settings/incident-types/item?id=" + inciData.categoryId;
            // $http.get(path).then(function (response) {
                

            // });
        }

        function createCategoriesOnEdit(inciData) {
            console.log(inciData);
            DashboardCategoryService.getAll(inciData.categoryId).then(function(response){
                $scope.dcategories = response.data;
                for (var i = 0; i < $scope.dcategories.length; i++) {
                    var data = {};
                    data.title = $scope.dcategories[i].name;
                    data.incidentId = inciData.id;
                    data.index = $scope.dcategories[i].position;
                    ClassService.savedCategoriesOnEdit(data).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post('/class/saved-categories-on-edit', { data: data }).then(function (response) {
                    // });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = '/settings/dashboard-categories/all?id=' + inciData.categoryId;
            // $http.get(path).then(function (response) {
                
            // });
        }
    }

    function incidentsCtrl($scope, $filter, $http, $location, ModalService,Query, IncidentService) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.incidents = [];
            var set = false;
            $scope.incidentStatusOptions = [
                {name: 'All Incidents' , value : 'All'},
                {name: 'Active Incidents', value: 'Active'},
                {name: 'On Hold Incidents', value: 'OnHold'},
                {name: 'Closed Incidents', value: 'Closed'},
            ]

            $scope.currentStatus = $scope.incidentStatusOptions[0];

        }
        init();
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.IncidentTable = function (tableState) {
            $scope.tableState = tableState;
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $scope.user = Query.getCookie('user');
            var path = "/settings/tasks/all?userAccountId=" + $scope.user.userAccountId;

            IncidentService.list($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
                _.each($scope.incidents , function(incident, key) {
                    if(!incident.incident_plans && incident.incident_plans.length > 0){
                        if(incident.incident_plans[0].action_plan){
                            $scope.incidents[key].planName = incident.incident_plans[0].action_plan.name;
                        }
                    }
                });
                if($scope.currentStatus.value !== 'All'){
                    $scope.incidents = Query.filter($scope.incidents, {active: $scope.currentStatus.value}, false)
                }
                // $scope.sortByCreated = _.sortBy($scope.incidents, function (o) { return new Date(o.updatedAt); });
                // $scope.incidents = $scope.sortByCreated.reverse();
                $scope.sortByCreate = _.sortBy($scope.incidents, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = $scope.incidents.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.incidents = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/api/incidents/list?userAccountId=" + $scope.user.userAccountId).then(function (response) {
                
            // });
        };
        $scope.changeIncidentStatus = function(status){
            $scope.currentStatus = status;
            $scope.IncidentTable($scope.tableState);
        };
        $scope.openEditModal = function (id) {
            ModalService.showModal({
                templateUrl: "views/incidents/editModal.html",
                controller: "incidentCtrl",
                inputs: {
                    IncidentId: id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log('incident',result);
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(result && result.data){
                        $scope.IncidentTable($scope.tableState)
                    }
                });
            });
        };

    }

})();
