(function () {
    'use strict';

    angular.module('app')
    .controller('archiveStatusReportCtrl', ['$scope',
        '$rootScope',
        '$http',
        'AuthService',

        '$location',
        '$filter',
        'ModalService',
        'incident',
        'ReportService',
        ctrlFunction]);

    function ctrlFunction($scope,
        $rootScope,
        $http,
        AuthService,

        $location,
        $filter,
        ModalService,
        incident,
        ReportService
        ) {
        function init(){
         $scope.incident = incident;
                ReportService.incidentReport($scope.incident).then(function(response){
                    $scope.reports = response.data;
                    var sortByCreated = _.sortBy($scope.reports, function (o) { return new Date(o.createdAt); });
                    $scope.reports = sortByCreated.reverse();
                    $scope.safeReports = $scope.reports;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/reports/incident-report', {data: $scope.incident}).then(function(response) {
                    
                // });
        }

        init();
        $scope.StatusReport = function (report) {
            ModalService.showModal({
                templateUrl: "views/home/closed-Status-report.html",
                controller: "closedReportViewCtrl",
                inputs: {
                    report: report
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
    }
} ());
