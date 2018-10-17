(function () {
    'use strict';

    angular.module('app')
        .controller('reportsCreateCtrl', ['$scope', 'close', '$routeParams', '$http', 'AuthService', '$location','Query','IncidentService', ctrlFunction]);

        function ctrlFunction($scope, close, $routeParams, $http, AuthService, $location,Query, IncidentService) {

             function init() {
                 $scope.user = Query.getCookie('user');
                 IncidentService.all($scope.user.userAccountId).then(function(response){
                    $scope.incidents = response.data;
                 },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

                 });
                 // $http.get('/api/incidents/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                 //     $scope.incidents = response.data;
                 // });
             }
             init();

             $scope.close = function() {
 	            close();
             };

             $scope.submit = function(incidentId) {
                 if(incidentId !== undefined) {
                     var path = "/reports/view/" + incidentId;
                     $location.path(path);
                 }
             }
        }
}());
