(function () {
    'use strict';

    angular.module('app')
        .controller('statusReportsMailCtrl', ['$scope', 'close', '$filter','$routeParams', '$http', 'AuthService', '$location', 'statusReport','Query','IncidentTeamService','MailService','ReportService','EmailTrackService', ctrlFunction]);

        function ctrlFunction($scope, close ,$filter,$routeParams, $http, AuthService, $location, statusReport,Query, IncidentTeamService, MailService, ReportService, EmailTrackService) {

             function init() {
                IncidentTeamService.all().then(function(response){
                    $scope.email_list = response.data;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/incident-teams/all").then(function(response) {
                    
                // });
                var date = new Date();
                date = $filter('date')(date, "dd/MM/yyyy");
                $scope.user = Query.getCookie('user');
                $scope.Report = '<strong>Incident Status Report '+date+'</strong><br><strong> From: '+ $scope.user.firstName+' '+$scope.user.lastName+'</strong>'+
                   '<br>';
                   $scope.Report += statusReport.content;
                   console.log($scope.Report)
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
                     html: $scope.Report,
                     report_id: statusReport.id
                 };
                 MailService.send(mailOptions).then(function(response){
                    toastr.success("Email sent successfully.");
                     var report = {
                        id: statusReport.id,
                        sent: true
                     }
                     ReportService.update(report).then(function(response){

                     },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                     });
                     // $http.post('/reports/update', {data: report}).then(function(response) {
                     // });
                     var dat = {type: 'Summary Report'};
                     dat.statusReportId = statusReport.id;
                     dat.content = statusReport.content;
                     dat.sentTo = sendto;
                     dat.date = moment().utc().format();
                     dat.createdAt = moment().utc().format();
                     EmailTrackService.save(dat).then(function(res){

                     },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                     });
                     // $http.post('/email-track/save', {data: dat}).then(function(res) {
                     // });
                     close();
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
