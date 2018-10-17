(function () {
    'use strict';

    angular.module('app')
    .controller('afterSaveActionPlanCtrl', ['$q','ModalService','actionPlan','$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'Query','ActionPlanService', ctrlFunction]);

    function ctrlFunction($q, ModalService, actionPlan, $scope, close, $location, $routeParams, $http, AuthService, Query, ActionPlanService) {

        function init() {
            $scope.user = Query.getCookie('user');
            $scope.actionPlan = actionPlan;
        }
        init();
        $scope.cancel = function(){
            close(undefined);
        }
        $scope.editNewPlan = function (planId) {
            ModalService.showModal({
                templateUrl: "views/settings/action-plans/form-modal-edit.html",
                controller: "editActionPlanModalCtrl",
                inputs: {
                    planId: $scope.actionPlan.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.actionPlan = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.toAssignActionPlan = function(){
            close('TO-AP-DASHBOARD');
        }
        $scope.printPlan=function(plan){
            $scope.printPlanActivities='';
            $scope.printPlanActivities+='<h1>Plan Name: '+ plan.name+'</h1><br>'
            ActionPlanService.activities(plan.id).then(function(response){
                var loopPromises = [];
                $scope.activities = response.data;
                $scope.printPlanActivities+='<table>'
                _.each($scope.activities, function (activity,ind) {
                    var deferred = $q.defer();
                    loopPromises.push(deferred.promise);
                    if(activity.role==null || activity.responsibility_level==null){
                        activity.role='N/A';
                        activity.responsibility_level='N/A';
                    }
                    // console.log(activity);

                    $scope.printPlanActivities+='<tr>'
                    $scope.printPlanActivities+='<td>' + ind + ' - ' + activity.title +'</td>'

                    // $scope.printPlanActivities+='<td>Description: '+ activity.description +'</td>'
                    $scope.printPlanActivities+='</tr>'

                    $scope.printPlanActivities+='<tr>'
                    $scope.printPlanActivities+='<td></td>'
                    $scope.printPlanActivities+='<td></td>'
                    $scope.printPlanActivities+='</tr>'

                    setTimeout(function () {
                        deferred.resolve();
                        console.log('long-running operation inside loop done');
                    }, 2000);
                });
                $scope.printPlanActivities+='</table>'

                $q.all(loopPromises).then(function () {
                    console.log($scope.printPlanActivities);
                    var printContents=$scope.printPlanActivities;
                    var popupWin = window.open('', '_blank', 'width=1000,height=800');
                    if(popupWin){
                        popupWin.document.open();
                        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                        popupWin.document.close();
                    }
                });
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.get("/settings/action-plans/activities?actionPlanId=" + plan.id)
            // .then(function (response) {

                
            // });
        }
    }
}());
