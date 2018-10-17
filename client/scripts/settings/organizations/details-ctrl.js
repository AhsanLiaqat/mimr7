(function () {
    'use strict';

    angular.module('app')
        .controller('organizationsDetailCtrl', ['$scope', '$location', '$filter','$routeParams', '$http', 'AuthService','OrganizationService', ctrlFunction]);

    function ctrlFunction($scope, $location, $filter, $routeParams, $http, AuthService, OrganizationService) {

        function init() {
           
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.orgUserTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;  

            if($routeParams.id !== undefined) {
               $scope.orgId = $routeParams.id;
               OrganizationService.get($routeParams.id).then(function(response){
                $scope.organization = response.data;
                    $scope.users = response.data.users;
                    $scope.a = _.sortBy($scope.users, function (o) { return new Date(o.title); });

                    $scope.total = response.data.users.length;
                    var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                    if (tableState.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                    }

                    var result = filtered.slice(start, start + number);

                    $scope.users = result;

                    tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                    $scope.isLoading = false;
               },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
               });
                // var path = "/settings/organizations/get?id=" + $routeParams.id;
                // $http.get(path).then(function(response) {
                    
                // });
           }

        };
        $scope.deleteUser = function(user, index){
            var data = {id: user.id}
                $http.post("/users/delete", data).then(function(response) {
                    toastr.success('User deleted', 'Success!');
                    $scope.users.splice(index, 1);
            });
        };

        $scope.dateFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
      
        init();
    }

}());
