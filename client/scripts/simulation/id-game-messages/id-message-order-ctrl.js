(function () {
    'use strict';

    angular.module('app')
    .controller('orderIdMessageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams'	, taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams) {
    	// fetch initial data
        var init = function(){
            $scope.posArr = [];
        	for( var i=0; i<=30; i++ ){
        		$scope.posArr.push(i);
        	}	
            $http.get('/simulation/id-games/get/'+$routeParams.gameId).then(function(response) {
            	$scope.data = response.data;
                $scope.messages = response.data.id_messages;
            });
        }
        init();
        // order/sort array on column provided 
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.messages = $filter('orderBy')($scope.messages, rowName);
        };
        
        //save order
        $scope.save = function(){
        	var found = false;
        	angular.forEach($scope.messages, function (msg, index) {
        		if(msg.order < 0 || msg.order > 30){
        			found = true;
        		}
        	});
        	if(!found){
        		angular.forEach($scope.messages, function (msg, index) {
			        $http.put("/simulation/id-game-messages/update/"+msg.id ,{data: msg}).then(function(response) {
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