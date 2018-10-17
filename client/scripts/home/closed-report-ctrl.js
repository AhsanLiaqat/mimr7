(function () {
    'use strict';

    angular.module('app')
        .controller('closedReportViewCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','$sce','report','ReportService', viewFunction]);

        function viewFunction($scope, $routeParams, $http, AuthService, ModalService, $location,$sce,report, ReportService) {

            function init() {
              
                   
                $scope.report = report;
                        
                $scope.re = $sce.trustAsHtml($scope.report.content);

                $scope.tinymceOptions = {
                    statusbar: false,
                    menubar: false,
                    plugins: 'print',
                    height:  '500px',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | print '
                };              
           }

            $scope.updateReport = function() {
                $scope.report.date = moment().utc().format();
                ReportService.update($scope.report).then(function(response){
                    toastr.success("Update successful");
                    $location.path('/reports');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/reports/update', {data: $scope.report}).then(function(response) {
                   
                // });
            };

            $scope.emailModel = function() {
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/status-report/reports.email.html",
                    controller:  "reportsMailCtrl",
                    inputs: {
                        statusReport: $scope.report.content  
                    }
                }).then(function(modal) {
                    modal.element.modal( {backdrop: 'static',  keyboard: false });
                    modal.close.then(function(result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            };

            $scope.printReport= function()  
            {   html2canvas(document.getElementById('print'), {
                        "onrendered": function (canvas) {
                           var dataUrl = canvas.toDataURL();
               var windowContent = '<img src="' + dataUrl + '">';

                var printWin = window.open('','','width=700,height=500');
                printWin.document.open();
                printWin.document.write(windowContent);
                printWin.document.close();
                printWin.focus();
                printWin.print();
                printWin.close();
                    }
                })
            }

            init();
        }

}());
