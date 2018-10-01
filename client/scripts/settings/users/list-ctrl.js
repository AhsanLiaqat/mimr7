(function () {
    'use strict';

    angular.module('app')
    .controller('userListCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','Query', userFunc]); 

    function userFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,Query) {
        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        
        $scope.init = function (tableState) {
            $scope.currentUser = Query.getCookie('user');
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;  

            $http.get('users/list').then(function(response) {
                $scope.users = response.data;
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')(response.data, tableState.search.predicateObject) : response.data;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }

                var result = filtered.slice(start, start + number);

                $scope.users = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            });
        };

        $scope.viewModal = function(Id) {
            ModalService.showModal({
                templateUrl: "views/settings/users/view.html",
                controller: "userViewCtrl",
                inputs: {
                        id: Id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteUser = function(id) {
            $http.post('/users/delete', { id: id }).then(function(res) {
                toastr.success("User deleted successfully!");
                $route.reload(); 
            });
        };
    };
}());