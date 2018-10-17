(function () {
    'use strict';

    angular.module('app')
        .controller('newGameCategoryCtrl', NewGameCategoryCtrl)
       
    function NewGameCategoryCtrl($scope, $filter, close, ModalService, $http, $timeout, Query, category) {

        //set initial data
		function init() {
            $scope.user = Query.getCookie('user');
            if(category == null){
                $scope.data = {};
            }else{
                $scope.data = {};
                $scope.data = angular.copy(category);
            }
		}

        // add or edit category data
        $scope.submit = function() {
		    if (!$scope.data.name || $scope.data.name === ""){
                toastr.error('Please provide category name', 'Error!');
            }else{
                if($scope.data.id === undefined) {
                    $scope.data.userAccountId = $scope.user.userAccountId;
                    $http.post('/simulation/game-categories/save', {data: $scope.data}).then(function(response) {
                        toastr.success("Game category saved successfully!");
                        close(response.data);
                    });
                }
                else {
                    $scope.data.incident = null;
                    $http.post('/simulation/game-categories/save', {data: $scope.data}).then(function(response) {
                        toastr.success("Game category updated successfully!");
                        close($scope.data);
                    });
                }
            }
        };

        //close modal
        $scope.close = function() {
            close();
        };

		init();

    };

})(); 
