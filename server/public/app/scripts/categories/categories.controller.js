(function () {
    'use strict';

    angular.module('app.categories')
        .controller('categoriesCtrl', ['$scope', '$filter', '$http', categoriesCtrl])
        .controller('categoryCtrl', ['$scope', '$filter', '$http', '$timeout', categoryCtrl]);

    function categoryCtrl($scope, $filter, $http, $timeout) {
        console.log($scope)
        $scope.data = {
            locations: [""]
        };
        var input = document.getElementById('locationInput');
        var inputs = document.getElementsByClassName("locations");
        
        console.log(inputs);
        $scope.remove = function(idx){
            console.log($scope.data, idx);
            //$scope.data.locations.splice(idx, 1);
        };
        
        $scope.addLocation = function(){
            $scope.data.locations.push("");
        };
        
        $scope.save = function(){
            $http.post("/api/incidents/save", $scope.data);
        };
    }

    function categoriessCtrl($scope, $filter, $http) {
        $scope.users = [];
        
        $http.get("/users/list").then(function(res){
            $scope.users = res.data;
        })

    }

})(); 