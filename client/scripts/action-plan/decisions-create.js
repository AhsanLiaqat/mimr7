(function () {
    'use strict';

    angular.module('app')
    .controller('DecisionCreateCtrl', ['$scope', 'ModalService', '$routeParams', '$http', 'AuthService', '$location','ActionService','DecisionService', ctrlFunction]);

    function ctrlFunction($scope, ModalService, $routeParams, $http, AuthService, $location, ActionService, DecisionService) {

        function init() {
            $scope.expand = false;
            $scope.data1 = {};
            ActionService.all().then(function(response){
                $scope.tasks = response.data;
                if($routeParams.id !== undefined) {
                    DecisionService.get($routeParams.id).then(function(response){
                        $scope.data1 = response.data;
                        $scope.data1.possible_outcomes = parseInt($scope.data1.possible_outcomes);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var path = '/decisions/get?id=' + $routeParams.id;
                    // $http.get(path).then(function(response) {
                        
                    // });
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/actions/all').then(function(response) {
                
            // });

        }

        $scope.toggleDecision = function() {
            $scope.expand = !$scope.expand;
        };

        $scope.submit = function(data) {
            if(data.id === undefined) {
                $http.post('/decisions/save', { data: data }).then(function(response) {
                    toastr.success("Saved successfully");
                    $location.path('/decisions');
                });
            }
            else {
                DecisionService.update(data).then(function(response){
                    toastr.success("Updated successfully");
                    $location.path('/decisions');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/decisions/update', { data: data }).then(function(response) {
                    
                // });
            }

        };

        $scope.outcomes = function(outcomes) {
            console.log(outcomes);
            $scope.data1.content = [];
            var out = function(outcome, action) {
                this.outcome = outcome;
                this.actionId = action;
            }
            for(var i=0; i<outcomes; i++) {
                $scope.data1.content.push(new out("", ""));
            }
            console.log($scope.data1.content)
        };

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        init();

    }
}());
