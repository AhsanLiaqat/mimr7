(function () {
    'use strict';

    angular.module('app')
        .controller('emailSentToCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', '$location', 'reportId','ReportService','EmailTrackService', ctrlFunction]); 

        function ctrlFunction($scope, close, $routeParams, $http, AuthService, $location, reportId, ReportService, EmailTrackService) {

             function init() {
                 if(reportId !== undefined) {
                    EmailTrackService.all(reportId).then(function(response){
                        $scope.emails = response.data;
                         var sentTo = '';
                        for(var i=0; i<$scope.emails.length; i++) {
                            sentTo = sentTo + $scope.emails[i].sentTo + ', ' ;
                        }
                        $scope.sentTo = sentTo;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                     // var path= "/email-track/all?id=" + reportId;
                     // $http.get(path).then(function(response) {
                        
                     // });

                     ReportService.get(reportId).then(function(response){
                        $scope.report = response.data
                     },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                     });
                     // var query =  '/reports/get?id=' + reportId;
                     // $http.get(query).then(function(response) {
                       
                     // });
                 }

                 $scope.tinymceOptions = {
                    inline: false,
                    pluging: 'print',
                   statusbar: false,
                    toolbar: "print"
                };

             }

             init();

             $scope.close = function() {
 	            close();
             };

        }
}());
