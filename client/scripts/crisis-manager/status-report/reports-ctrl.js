(function () {
    'use strict';

    angular.module('app')
        .controller('statusReportsCtrl', ['$scope', '$routeParams', '$http', '$filter', 'AuthService', 'ModalService','Query','ReportService','IncidentService', reportFunction]);
        function reportFunction($scope, $routeParams, $http, $filter, AuthService, ModalService,Query,ReportService, IncidentService) {

        $scope.items = [{name: '5 items per page', val: 5},
                        {name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 5;

        $scope.showHtmlView = function(record){
            ModalService.showModal({
                templateUrl: "views/crisis-manager/status-report/report.modal.view.html",
                controller:  "reportViewModalCtrl",
                inputs: {
                    report: record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.user = Query.getCookie('user');

        $scope.init = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 5;

            IncidentService.all($scope.user.userAccountId).then(function(response){
                $scope.incidents = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
            ReportService.all().then(function(response){
                $scope.reports = response.data;
                $scope.safeReports = angular.copy($scope.reports);
                $scope.total = response.data.length;

                $scope.sortByCreate = _.sortBy($scope.reports, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();

                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $scope.reports = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')                    
            });
            // $http.get('/reports/all').then(function(response) {
                
            // });
        };

        $scope.creatNew = function() {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/status-report/reports.create.html",
                controller:  "reportsCreateCtrl",
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.viewEmail = function(emailTrackId) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/status-report/report.emailtracking.html",
                controller:  "emailSentToCtrl",
                inputs: {
                    reportId: emailTrackId
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

            // init();
    }

}());
