(function () {
    'use strict';

    angular.module('app')
    .controller('actionDeleteCtrl', ['$scope', 'close',  '$routeParams', '$http', '$location', 'actionId','ActionService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $location, actionId, ActionService) {

        function init() {
            $scope.title ="Action"
        }

        $scope.submit = function() {
            var data = {};
            data.id = actionId;
            data.status = false;
            ActionService.update(data).then(function(response){
                toastr.success("Action removed successfully");
                close();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/actions/update', {data: data}).then(function(response) {
                
            // });
        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
