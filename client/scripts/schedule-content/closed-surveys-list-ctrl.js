(function () {
    'use strict';

    angular.module('app')
        .controller('closedSurveysCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', closedSurveyCtrl]);

    function closedSurveyCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location) {

        //setting initial data 
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.surveyTable = function (tableState) {
            $scope.tableState = tableState;
            $scope.isLoading = true;
            $http.get('/content-plan-templates/closed-surveys')
            .then(function (response) {
                $scope.closed_surveys = response.data;
                $scope.managearray();
            });
        };
        
        //do pagination
        $scope.paginate = function(arr){
            $scope.a = arr;
            $scope.total = arr.length;
            var tableState = $scope.tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
            if (tableState.sort.predicate) {
                filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
            }
            var result = filtered.slice(start, start + number);
            tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
            $scope.isLoading = false;
            return result;      
        }

        //filter array on schedule type status
        $scope.managearray = function(){
            $scope.surveyToShow = $scope.paginate($scope.closed_surveys);
        }

        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('DD-MM-YYYY');
        };
    }
}());