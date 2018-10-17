(function () {
    'use strict';

    angular.module('app')
    .controller('newPlanModalCtrl', ['$scope', 'close', '$http', '$filter', 'AuthService', '$location', 'ModalService', 'filterFilter','Query','IncidentTypeService','ScenarioService','ActionPlanService','SectionService', ctrlFunction]);

    function ctrlFunction($scope, close, $http, $filter, AuthService, $location, ModalService, filterFilter,Query, IncidentTypeService, ScenarioService, ActionPlanService, SectionService) {
        $scope.loadScenario = function(id){
            $scope.scenarioOptions = []
            angular.forEach($scope.scenarioOptionsAll, function (elem) {
                if(elem.category == null || elem.category.id == id){
                    $scope.scenarioOptions.push(elem);
                }
            });
        }

        function init() {
            $scope.user = Query.getCookie('user');
            ScenarioService.list($scope.user.userAccountId).then(function(response){
                $scope.scenarioOptions = response.data;
                $scope.scenarioOptionsAll = angular.copy($scope.scenarioOptions);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/scenarios/list?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            $scope.sections = [];
            $scope.searchKeywords = ''
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

            $scope.data = {kind: 'agendaPoints'};
            var date = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.data.plandate = date;
        };
        init();

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
            if ($scope.data.name != null && data.plandate != null) {
                console.log($scope.data.categoryId)
                $scope.data.type = ($scope.data.categoryId)? Query.filter($scope.categories,{'id': $scope.data.categoryId},true).name : '';
                if (data.id === undefined) {
                    data.plandate = moment.utc(data.plandate, 'DD/MM/YYYY', true).format();
                    data.isComplete = false;
                    ActionPlanService.save(data).then(function(response){
                        $scope.data = response.data;
                        $scope.createNewSection();
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
            } else {
                toastr.error("Please Fill Required Fields");
            }
        };

        $scope.closePicker = function () {
            $('.datepicker').hide();
        };

        $scope.saveExit = function () {
            close($scope.data);
        };
        $scope.closeModal = function () {
            close(undefined);
        };

        $scope.createNewSection = function() {
            SectionService.createDefault({actionPlanId: $scope.data.id}).then(function(response){
                $scope.saveExit()
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/sections/create-default', {actionPlanId: $scope.data.id}).then(function (response) {
                
            // });
        };
    }
}());
