(function () {
    'use strict';

    angular.module('app')
        .controller('reportsMailCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', '$location', 'statusReport','IncidentTeamService','MailService','ReportService','EmailTrackService', ctrlFunction]);

        function ctrlFunction($scope, close, $routeParams, $http, AuthService, $location, statusReport, IncidentTeamService, MailService, ReportService, EmailTrackService) {

             function init() {
                $scope.report = statusReport;
                 if($routeParams.id !== undefined) {
                     ReportService.get($routeParams.id).then(function(response){
                        $scope.report = response.data;
                     },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                     });
                     // var path = '/reports/get?id=' + $routeParams.id;
                     // $http.get(path).then(function(response) {
                         
                     // });
                     IncidentTeamService.all().then(function(response){
                        $scope.email_list = response.data;
                     },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                     });
                    //  $http.get("/settings/incident-teams/all").then(function(response) {
                        
                    // });
                 }

             }

             init();

             $scope.close = function() {
 	            close();
             };

             $scope.submit = function(sendTo, list) {
                var sendto;
                if(sendTo !== undefined && list === undefined) {
                    sendto = sendTo;
                }
                else if(sendTo !== undefined && list !== undefined) {
                     sendto = sendTo + ',' + list;
                }
                else if(sendTo === undefined && list !== undefined) {
                    sendto = list;
                }

                var mailOptions = {
                     from: 'noreply@crisishub.co',
                     to: sendto,
                     subject: 'Incident Status Report',
                     html: statusReport,
                     report_id: $scope.report.id
                 };
                 MailService.send(mailOptions).then(function(response){
                    $scope.report.sent = true;
                    ReportService.update($scope.report).then(function(response){

                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                   // $http.post('/reports/update', {data: $scope.report}).then(function(response) {
                   //  });
                     if(response !== undefined ) {
                         if(response.status === 200) {
                             var data = {};
                             data.statusReportId = $routeParams.id;
                             data.content = statusReport;
                             data.sentTo = sendto;
                             data.createdAt = moment().utc().format();
                             EmailTrackService.save(data).then(function(res){

                             },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                             });
                             // $http.post('/email-track/save', {data: data}).then(function(res) {

                             // });

                             toastr.success("Email sent successfully.");
                             close();
                         }
                     }
                     else {
                         toastr.error("Error occurrred.");
                         close();
                     }
                 },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                 });
                 // $http.post('/mail/send', {data: mailOptions}).then(function(response) {
                   
                 // });
             }
        }
}());
