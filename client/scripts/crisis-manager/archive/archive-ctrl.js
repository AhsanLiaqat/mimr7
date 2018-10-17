(function () {
    'use strict';

    angular.module('app')
    .controller('archiveCtrl', ['$scope',
        '$rootScope',
        '$routeParams',
        '$http',
        'AuthService',
        '$location',
        '$filter',
        'ModalService',
        'Query',
        'IncidentService',
        ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        $routeParams,
        $http,
        AuthService,
        $location,
        $filter,
        ModalService,
        Query,
        IncidentService
        ) {

        $scope.user = Query.getCookie('user');
        function init() {
            $scope.incidents = [];
            var set = false;
        };
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.Archive = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            IncidentService.archiveList($scope.user.userAccountId).then(function(res){
                $scope.incidents = res.data;
                $scope.sortByCreate = _.sortBy($scope.incidents, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = res.data.length;
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
            // $http.get("/api/incidents/archive-list?userAccountId=" + $scope.user.userAccountId).then(function (res) {
                
            // });
        };
        $scope.openTimeLine = function ($index) {
                    ModalService.showModal({
                        templateUrl: "views/crisis-manager/archive/archive-timeline.html",
                        controller: "archiveTimelineCtrl",
                        inputs: {
                            incident: $scope.incidents[$index]
                        }
                    }).then(function (modal) {
                        modal.element.modal({ backdrop: 'static', keyboard: false });
                        modal.close.then(function () {
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                        });
                    });
                };

        // $scope.deleteArchive = function(inci, index){
        //     IncidentService.delete(inci.id).then(function(res){
        //         toastr.success("Delete successful");
        //         $scope.incidents.splice(index,1);
        //     },function(err){
        //         if(err)
        //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
        //         else
        //             toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        //     });
        //     // $http.post("/api/incidents/delete", {id: inci.id}).then(function(res) {
                
        //     // });
        // }

        $scope.deleteArchive = function (inci,index) { // tick
            ModalService.showModal({
                templateUrl: "views/incidents/delete-incident-popup.html",
                controller: "removeIncidentCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result != undefined && result.answer === '87654321'){
                        IncidentService.delete(inci.id).then(function(res){
                            toastr.success("Delete successful");
                            $scope.incidents.splice(index,1);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/api/incidents/delete', { id:  incidentId }).then(function (res) {
                            
                        // });
                    }else{
                        toastr.error('Incident not deleted, Try again!');
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });

        }

        $scope.statusReport = function ($index) {
                    ModalService.showModal({
                        templateUrl: "views/incidents/archive-status-report-modal.html",
                        controller: "archiveStatusReportCtrl",
                        inputs: {
                            incident: $scope.incidents[$index]
                        }
                    }).then(function (modal) {
                        modal.element.modal({ backdrop: 'static', keyboard: false });
                        modal.close.then(function () {
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');
                        });
                    });
        }
        init();
    }
} ());
