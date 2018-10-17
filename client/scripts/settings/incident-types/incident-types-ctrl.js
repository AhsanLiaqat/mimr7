(function () {
    'use strict';

    angular.module('app')
        .controller('incidentTypesCtrl', categoriesCtrl)

    function categoriesCtrl($scope, $filter, ModalService, $http, $timeout, focus, IncidentTypeService) {

		function init() {
			$scope.categories = [];
            $scope.length
        	$timeout(function(){
        		focus("name");
        	});
            $scope.pageItems = 10;
            $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
		}

        $scope.TypeTable = function (tableState) {
            $scope.tableState = tableState;
            $scope.isLoading = true;

            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            IncidentTypeService.list().then(function(response){
                $scope.categories = response.data;
                $scope.sortByCreate = _.sortBy($scope.categories, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.categories = result;

                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/incident-types/list").then(function(response){
                
            // });
        };
	    $scope.delete = function(cat_id) {
            IncidentTypeService.delete(cat_id).then(function(res){
                toastr.success("Incident Type deleted successfully.");
                $scope.TypeTable($scope.tableState);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/incident-types/delete", {id: cat_id}).then(function(res){
                
            //  });
        }

		init();

    };

})();
