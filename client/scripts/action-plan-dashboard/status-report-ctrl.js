(function () {
    'use strict';

    angular.module('app')
    .controller('actionPlanStatusReportCtrl', ['$scope', '$routeParams', '$http', '$filter', 'AuthService', 'ModalService', '$location', 'filterFilter', 'close','activities', 'incident','Query','ReportService' ,viewFunction]);

    function viewFunction($scope, $routeParams, $http, $filter, AuthService, ModalService, $location, filterFilter, close, activities, incident,Query, ReportService) {

        function init() {
            $scope.activities = activities;
            $scope.activities = $filter('orderBy')($scope.activities, 'id');
            $scope.incident = incident;
            $scope.tinymceOptions = {
                theme: "modern",
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons template paste textcolor"
                ],
                toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                toolbar2: "print preview media | forecolor backcolor emoticons",
                image_advtab: true,
                statusbar: false
            };
            bindMessages();
        }
        init();

        function bindMessages() {
            $scope.user = Query.getCookie('user');
            $scope.status_report = '<h3>Incident: '  + $scope.incident.name + '</h3><h3>Action PLan Report: ' + $filter('date')(new Date(), "HH:mm dd-MM-yyyy") + '</h3>';

            $scope.status_report += '<h3>From: '  + $scope.user.firstName + ' ' + $scope.user.lastName + '</h3><br>';

            var initiatedActivities = filterFilter($scope.activities, {'activated': true});
            var pendingActivities = filterFilter($scope.activities, {'activated': false});
            initiatedActivities = $filter('orderBy')(initiatedActivities, 'index');
            pendingActivities = $filter('orderBy')(pendingActivities, 'index');

            if(initiatedActivities.length == 0 ){
                // $scope.status_report += '<h3>No Initiated Activities</h3><br>';
            }else{
                // $scope.status_report += '<h3>Initiated Activities</h3><br>';
                angular.forEach(initiatedActivities, function(activity, index){
                    if (!activity.status_filter && !activity.availability_filter && !activity.group_filter){
                        var ind = index+1;
                        $scope.status_report = $scope.status_report +'<p>' + ind + ' - ' + activity.name+' '+activity.description+' '+$filter('date')(activity.createdAt, "HH:mm dd-MM-yyyy")+' '+$filter('date')(activity.activatedAt, "HH:mm dd-MM-yyyy")+'</p><p>Status :'+ activity.status +'</p><br>';
                    }
                });
            }
            if(pendingActivities.length == 0 ){
            }else{
                angular.forEach(pendingActivities, function(activity, index){
                    if (!activity.status_filter && !activity.availability_filter && !activity.group_filter){
                        var ind = index+1;
                        $scope.status_report = $scope.status_report + '<p>' + ind + ' - ' + activity.name+' '+activity.description+'</p><p>Status :'+ activity.status +'</p><br>';
                    }
                });
            }
        };
        $scope.Printsummary = function (){
            var printContents = $scope.status_report;
            var popupWin = window.open('', '_blank', 'width=1000,height=800');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }

        $scope.save = function(content) {
            var data = {};
            data.content = content;
            data.date = moment().utc().format();
            data.incidentId = $scope.incident.id;
            data.incidentName =  $scope.incident.name;
            ReportService.save(data).then(function(response){
                toastr.success("Report Saved", "Success");
                data.id = response.data.id;
                $scope.emailModel(data);
                // $scope.close();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/reports/save', {data: data}).then(function(response) {
                
            // });
        };


        $scope.emailModel = function(data) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/status-report/reports.email.html",
                controller:  "statusReportsMailCtrl",
                inputs: {
                    statusReport: data
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }
        $scope.close = function(params) {
            params = (params == null || params == undefined)?'': params;
            close(params);
        };
    }
}());
