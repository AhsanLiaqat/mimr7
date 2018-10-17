(function () {
    'use strict';

    angular.module('app')
        .controller('simulationCategoryCtrl', simulationCategoryCtrl)
       
    function simulationCategoryCtrl($scope, $filter, ModalService, $http, $timeout, focus) {

		function init() {
			$scope.categories = [];
        	$timeout(function(){
        		focus("name");	
        	});
		}
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

            // function associated with table to fetch and set initial data
        $scope.TypeTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;  

                $http.get("/simulation/game-categories/all").then(function(response){
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
            });
        };
        //delete given category
	    $scope.delete = function(id, index) {
             $http.post("/simulation/game-categories/delete", {id: id}).then(function(res){ 
                toastr.success("deleted successfully.");
                $scope.categories.splice(index, 1);
             });
        }

        // open modal to create new category
        $scope.new = function() {
            ModalService.showModal({
                templateUrl: "views/simulation/categories/form.html",
                controller: "newGameCategoryCtrl",
                inputs:{
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result && result !== ''){
                        $scope.categories.push(result);
                    }
                   $('.modal-backdrop').remove();
                   $('body').removeClass('modal-open');
               });
            });
        };

        //opens modal to edit category
        $scope.edit = function(category, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/categories/form.html",
                controller: "newGameCategoryCtrl",
                inputs:{
                    category: category
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result && result != ''){
                        $scope.categories[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

		init();

    };

})(); 
