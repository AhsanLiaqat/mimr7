(function () {
    'use strict';

    angular.module('app')
        .controller('addIncidentModalCtrl', ['$scope',
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
            'CheckListService',
            'IncidentTypeService',
            'ActionPlanService',
            'IncidentPlanService',
            'ClassService',
            'IncidentService',
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
        CheckListService,
        IncidentTypeService,
        ActionPlanService,
        IncidentPlanService,
        ClassService,
        IncidentService) {

        function init() {
            $scope.data = {
                locations: [""]
            };
            $scope.selectedPlan = {};
            IncidentTypeService.list().then(function(response){
                $scope.categories = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/incident-types/list').then(function (response) {
                
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
        }
        init();

        $scope.addLocation = function () {
            $scope.data.locations.push("");
        };

        $scope.linkPlan = function () {
            $scope.link = true;
        };

        $scope.linkActionPlan = function (incidentID) {
            var planData = {
                actionPlanId: $scope.selectedPlan.id,
                incidentId: incidentID
            }
            console.log(planData);

            IncidentPlanService.save(planData).then(function(res){
                if (res.data.outcomes.length > 0) {
                    IncidentPlanService.addOutcomes(res.data.outcomes).then(function(res){
                            toastr.success('Incident created.', 'Success!');
                            console.log($scope.incident);
                            $scope.close($scope.incident);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post("/incident-plan/add-outcomes", res.data.outcomes)
                    //     .then(function (res) {

                    // })
                    } else {
                        toastr.success('Incident created.', 'Success!');
                        console.log($scope.incident);
                        $scope.close($scope.incident);
                    }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/incident-plan/save", planData)
            //     .then(function (res) {
                    
            // });
        };

        var validateData = function () {
            if (!$scope.data.name || $scope.data.name === '') {
                toastr.error('Please provide a valid name for incident.', 'Error!');
                return false;
            } else {
                return true;
            }
        };

        $scope.save = function () {
            if (validateData()) {
                var data = {};
                data.locations = $scope.data.locations;
                data.name = $scope.data.name;
                data.categoryId = $scope.data.categoryId;
                IncidentService.save(data).then(function(response){
                    $scope.incident = response.data;
                        if ($scope.data.categoryId) {
                            createCategories(response.data);
                        }
                        $scope.incident.incident_plans = [];
                        if ($scope.link == true && $scope.selectedPlan.id) {
                            $scope.incident.incident_plans.push({ selected: true,
                            action_plan :$scope.selectedPlan });
                            $scope.linkActionPlan(response.data.id);
                        } else {
                            $scope.incident.selected = false;
                            toastr.success('Incident created.', 'Success!');
                            $scope.close($scope.incident);
                        }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/api/incidents/save", data)
                //     .then(function (response) {
                        
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

        $scope.remove = function(idx){
    		$scope.data.locations.splice(idx, 1);
    	};

        $scope.createtype = function () {
            ModalService.showModal({
                templateUrl: "views/home/create-incident-type.html",
                controller: "incidentTypeCreate"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result.id && result.name) {
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.close = function (params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
