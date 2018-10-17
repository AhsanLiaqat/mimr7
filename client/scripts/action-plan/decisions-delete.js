(function () {
    'use strict';

    angular.module('app')
    .controller('DecisionDeleteCtrl', ['$scope', 'close',  '$routeParams', '$http', '$location', 'decisionId','DecisionService', ctrlFunction]);

    function ctrlFunction($scope, close, $routeParams, $http, $location, decisionId, DecisionService) {

        function init() {
            $scope.title = "Decision";
        }

        $scope.submit = function() {
            console.log(decisionId)
            var data = {};
            data.id = decisionId;
            data.status = false;
            DecisionService.update(data).then(function(response){
                toastr.success("Decision removed successfully");
                close();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post('/decisions/update', {data: data}).then(function(response) {
                
            // });
        };

        $scope.close = function() {
            close();
        };

        init();

    }
}());
