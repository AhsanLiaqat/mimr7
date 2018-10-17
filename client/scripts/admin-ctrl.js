(function () {
    'use strict';

    angular.module('app')
        .controller('adminCtrl', ['$scope', 'ModalService', '$routeParams', '$http', 'AuthService','$filter','AccountService', ctrlFunction]);

    function ctrlFunction($scope, ModalService, $routeParams, $http, AuthService,$filter, AccountService) {

        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[1];
        $scope.filteredStores = [];
        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.AdminTable = function (tableState) {
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                AccountService.all().then(function(response){
                    $scope.adminPanel = response.data;
                    $http.get('users/list2').then(function(res) {
                        $scope.usersList = res.data;
                        bindAccounts();
                        $scope.sortByCreate = _.sortBy($scope.accountsList, function (o) { return new Date(o.createdAt); });
                        $scope.accountsList = $scope.sortByCreate.reverse();
                        // $scope.search();
                        $scope.a = _.sortBy($scope.accountsList, function (o) { return o.name.toLowerCase(); });

                        $scope.total = $scope.accountsList.length;
                        var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                        if (tableState.sort.predicate) {
                            filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                        }
                        var result = filtered.slice(start, start + number);
                        $scope.accountsList = result;
                        tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                        $scope.isLoading = false;
                    });
                    
                    
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                
                // var path = "/settings/roles/all";
                // $http.get(path).then(function
                //     (response) {
                        
                // });
        };








        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            $scope.currentPageActivities = $scope.filteredStores.slice(start, end);
        };
        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.accountsList, $scope.searchKeywords);
            return $scope.onFilterChange();
        };
        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };
        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.filteredStores, rowName);
            $scope.select($scope.currentPage);
        };
        function init() {
            // AccountService.all().then(function(response){
            //     $scope.sortByCreate = _.sortBy(response.data, function (o) { return new Date(o.createdAt); });
            //     $scope.accounts = $scope.sortByCreate.reverse();
            //     $http.get('users/list2').then(function(res) {
            //         $scope.usersList = res.data;
            //         bindAccounts();
            //         $scope.search();
            //     });
            // },function(err){
            //     if(err)
            //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            //     else
            //         toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            // });
            // $http.get('/settings/accounts/all').then(function(response) {
                
            // });

            AuthService.user().then(function(response) {
            });
        }

        var obj = function(id, name, status, userId, adminName, email, password, createdAt, lastLogin) {
            this.id = id;
            this.name = name;
            this.status = status;
            this.userId = userId;
            this.adminName = adminName,
            this.email = email;
            this.password = password;
            this.createdAt = createdAt;
            this.lastLogin = lastLogin;

        };

        function bindAccounts() {
            $scope.accountsList = [];
            for(var j=0; j<$scope.adminPanel.length; j++) {
                for(var i=0; i<$scope.usersList.length; i++) {
                    if($scope.adminPanel[j].id === $scope.usersList[i].userAccountId && $scope.usersList[i].role == 'admin') {
                      var name = $scope.usersList[i].firstName + ' ' + $scope.usersList[i].lastName;

                      $scope.accountsList.push(new obj($scope.adminPanel[j].id, $scope.adminPanel[j].organizationName, $scope.adminPanel[j].status, $scope.usersList[i].id, name, $scope.usersList[i].email,$scope.usersList[i].password, $scope.usersList[i].createdAt, $scope.usersList[i].lastLogin));
                    }
                }
            }
        }

        $scope.dateFormat = function(dat) {
            if(dat !== null) {
                return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
            }
        };

        $scope.activateModal = function() {
            ModalService.showModal({
                templateUrl: "views/admin.edit.html",
                controller:  "AdminActivateCtrl",
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        init();

    }

}());
