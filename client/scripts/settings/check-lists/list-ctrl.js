(function () {
    'use strict';
    angular.module('app')
    .controller('checkListCtrl', ['$scope','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','CheckListService', ctrlFunction]);
    function ctrlFunction($scope,$filter, $location, $routeParams, $http, AuthService, ModalService, Query, CheckListService) {

        function init() {
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.checkListTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $scope.user = Query.getCookie('user');
            CheckListService.list($scope.user.userAccountId).then(function(response){
                $scope.check_lists = response.data;
                $scope.sortByCreate = _.sortBy($scope.check_lists, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.check_lists = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "settings/check-lists/list?accountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };

        $scope.createModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/check-lists/form.html",
                controller: "checkListCreateCtrl",
                inputs : {
                    checklist: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.check_lists.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.viewModal = function(checkList) {
            ModalService.showModal({
                templateUrl: "views/settings/check-lists/check-list-view-modal.html",
                controller: "checkListViewCtrl",
                inputs : {
                    checklist: checkList
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        $scope.editModal = function(checkList ,index) {
            ModalService.showModal({
                templateUrl: "views/settings/check-lists/form.html",
                controller: "checkListCreateCtrl",
                inputs : {
                    checklist: checkList
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result !== '' && result !== undefined){
                        init();
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.deletelist = function (list, index){
            CheckListService.delete(list.id).then(function(res){
                console.log(res);
                if(res.data.success){
                    $scope.check_lists.splice(index,1);
                    toastr.success("Delete successful");
                }else{
                    toastr.error("You cannot delete this checklist as being used somewhere.","Warning");
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/check-lists/delete", {id: list.id}).then(function(res) {
                
            // });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        init();

    }
}());
