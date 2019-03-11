(function () {
    'use strict';

    angular.module('app')
        .controller('organizationsCtrl', ['$scope', '$location', '$filter', '$routeParams', '$http', 'AuthService','Query','OrganizationService','ModalService', ctrlFunction]);

    function ctrlFunction($scope, $location, $filter, $routeParams, $http, AuthService,Query, OrganizationService, ModalService) {

        function init() {
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.orgTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;  

            $scope.user = Query.getCookie('user');
            OrganizationService.all($scope.user.userAccountId).then(function(response){
                $scope.organizations = response.data;
                $scope.sortByCreate = _.sortBy($scope.organizations, function (o) { return new Date(o.createdAt); });
                $scope.organizations = $scope.sortByCreate.reverse();

                $scope.a = _.sortBy($scope.organizations, function (o) { return new Date(o.title); });

                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.organizations = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')

            });
            // $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                
            // });
        };

        $scope.addPlayerList = function (organizationId) {
             ModalService.showModal({
                templateUrl: "views/settings/player-lists/form.html",
                controller: "playerListModalCtrl",
                inputs: {
                    list: null,
                    organizationId : organizationId
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteOrganization = function (id, index) {
            $http.delete('/settings/organizations/remove/' + id)
                .then(function(res){
                   $scope.organizations.splice(index, 1);
                });
        };

        $scope.dateFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };


        init();

    }

}());
