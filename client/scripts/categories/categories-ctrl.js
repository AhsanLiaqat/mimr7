(function () {
    'use strict';

    angular.module('app.categories')
    .controller('categoriesCtrl', ['$scope', '$filter', '$http', categoriesCtrl])
    .controller('categoryCtrl', ['$scope', '$filter', '$http', '$timeout','IncidentService', categoryCtrl]);

    function categoryCtrl($scope, $filter, $http, $timeout, IncidentService) {
        console.log($scope)
        $scope.data = {
            locations: [""]
        };
        var input = document.getElementById('locationInput');
        var inputs = document.getElementsByClassName("locations");

        console.log(inputs);
        $scope.remove = function(idx){
            console.log($scope.data, idx);
        };

        $scope.addLocation = function(){
            $scope.data.locations.push("");
        };

        $scope.save = function(){
            IncidentService.save($scope.data);
            // $http.post("/api/incidents/save", $scope.data);
        };
    };

    function categoriesCtrl($scope, $filter, $http) {
        $scope.users = [];
        $http.get("/users/list").then(function(res){
            $scope.users = res.data;
        })
    };
})();
