(function () {
    'use strict';

    angular.module('app')
    .controller('assignActionPlanModalCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'actionPlans', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, actionPlans) {
        function init() {
            $scope.actions = actionPlans;
            $scope.actionPlan = {};
            console.log(actionPlans);
        }

        $scope.save = function(name) {
            if($scope.actionPlan){
                close($scope.actionPlan)
            }else{
                toastr.error('Please select plan first', 'Error');
            }
        }

        $scope.close = function() {
            close();
        }

        init();

    }
}());
