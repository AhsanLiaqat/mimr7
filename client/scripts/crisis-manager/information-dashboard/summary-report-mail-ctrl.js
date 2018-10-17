(function () {
    'use strict';

    angular.module('app')
        .controller('summaryReportsMailCtrl', ['$scope', 'close','$filter', '$routeParams', '$http', 'AuthService', '$location', 'incident','report','report_id','Query','IncidentTeamService','MailService','ReportService','EmailTrackService',ctrlFunction]);
        function ctrlFunction($scope, close,$filter, $routeParams, $http, AuthService, $location,incident,report,report_id,Query, IncidentTeamService, MailService, ReportService, EmailTrackService) {

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
                 $scope.incident = incident;
                 $scope.user = Query.getCookie('user');
                 $scope.report = report;
                 $scope.object_to_html();
             }
             $scope.object_to_html = function(){
                var date = new Date();
                date = $filter('date')(date, "dd/MM/yyyy");
                // $scope.summaryReport = '<strong>Incident Summary Report '+date+'</strong><br><strong> From: '+ $scope.user.firstName+' '+$scope.user.lastName+'</strong>'+
                //    '<br><strong>incident Name: ' +$scope.incident.name+ '</strong><br><br>';
                $scope.summaryReport = '';
                $scope.summaryReport += $scope.report;
                console.log($scope.summaryReport);
            }
            init();

             $scope.close = function() {
 	            close();
             };

             $scope.submit = function(sendTo, Cclist, Bcclist) {
                var sendto;
                if(sendTo !== undefined) {
                    sendto = sendTo;
                }
                // else if(sendTo !== undefined && list !== undefined) {
                //      sendto = sendTo + ',' + list;
                // }
                // else if(sendTo === undefined && list !== undefined) {
                //     sendto = list;
                // }

                var mailOptions = {
                     from: 'noreply@crisishub.co',
                     to: sendto,
                     subject: 'Summary Report',
                     html: $scope.summaryReport
                 };
                 if(Cclist && Cclist.length > 0){
                    mailOptions.cc = Cclist;
                 }
                 if(Bcclist && Bcclist.length > 0){
                    mailOptions.bcc = Bcclist;

                 }
                 console.log(mailOptions);
                 $scope.Report = {};
                 $scope.Report.sent = true;
                 $scope.Report.id = report_id;
                 $scope.Report.content = $scope.report;
                 $scope.Report.incidentId = incident.id;
                 $scope.Report.incidentName = incident.name;
                 ReportService.update($scope.Report).then(function(response){
                    console.log('updated',response.data);
                 },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                 });
                 // $http.post('/reports/update', {data: $scope.Report}).then(function(response) {
                    
                 // });
                 MailService.send(mailOptions).then(function(response){
                    var dat = {type: 'Summary Report'};
                     dat.statusReportId = $scope.Report.id;
                     dat.content = $scope.Report.content;
                     dat.sentTo = sendto;
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
                    toastr.success("Email sent successfully.");
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
