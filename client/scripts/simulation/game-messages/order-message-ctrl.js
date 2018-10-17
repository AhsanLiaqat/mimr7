(function () {
    'use strict';

    angular.module('app')
    .controller('orderMessageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams'	, taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams) {
    	
        //setting and fetching sme initial data 
        $scope.posArr = [];
    	for( var i=0; i<=30; i++ ){
    		$scope.posArr.push(i);
    	}
        var path = "/simulation/game-messages/get-plan-message/" + $routeParams.gamePlanId;
        $http.get(path).then(function(response) {
        	$scope.messages = response.data;
        });	
        $http.get('/simulation/games/get/'+$routeParams.gamePlanId).then(function(response) {
        	$scope.data = response.data;
        });

        //order list on column name
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.messages = $filter('orderBy')($scope.messages, rowName);
        };

        //save ordering
        $scope.save = function(){
        	var found = false;
        	angular.forEach($scope.messages, function (msg, index) {
        		if(msg.order < 0 || msg.order > 30){
        			found = true;
        		}
        	});
        	if(!found){
        		angular.forEach($scope.messages, function (msg, index) {
			        $http.post("/simulation/game-messages/update" ,{data: msg}).then(function(response) {
			        	if(index == $scope.messages.length-1){
			        		$location.path('simulation/home');
			        	}
			        });
	        	});
        	}else{
        		toastr.error('Please set all message Sequencing', 'Error!');
        	}
        }

    }
    

}());