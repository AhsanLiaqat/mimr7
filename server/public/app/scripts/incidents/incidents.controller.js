(function () {
    'use strict';

    angular.module('app.incidents')
        .controller('incidentsCtrl', ['$scope', '$filter', '$http', incidentsCtrl])
        .controller('incidentCtrl', ['$scope', '$filter', '$http', '$timeout', incidentCtrl]);

    function incidentCtrl($scope, $filter, $http, $timeout) {
        console.log($scope)
        $scope.data = {
            locations: [""]
        };
        var input = document.getElementById('locationInput');
        var inputs = document.getElementsByClassName("locations");
        
        $scope.remove = function(idx){
            $scope.data.locations.splice(idx, 1);
        };
        
        $scope.addLocation = function(){
            $scope.data.locations.push("");
        };
        
        $scope.save = function(){
            $http.post("/api/incidents/save", $scope.data);
        };
    }

    function incidentsCtrl($scope, $filter, $http) {
        $scope.users = [];
        
        $http.get("/users/list").then(function(res){
            $scope.users = res.data;
        })

    }

})(); 