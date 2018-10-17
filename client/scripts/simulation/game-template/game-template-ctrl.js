(function () {
    'use strict';

    angular.module('app')
        .controller('gameTemplateCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', ctrlFunction]);

    function ctrlFunction($scope, $filter, $routeParams, $http, AuthService, ModalService, $location) {

        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.dateFormat = function (dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        //function associated with table to fetch and set initial data
        $scope.templateTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            $http.get('/simulation/games/all').then(function (response) {
                $scope.a = $scope.gameTemplates = response.data;
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.gameTemplates = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            });
        };

        //fetch and set some initial list of data
        $scope.init = function () {
            $scope.isLoading = true;
            $http.get('/simulation/games/all').then(function (response) {
                $scope.gameTemplates = response.data;
                $scope.isLoading = false;
            });
        };
        $scope.init();
      
        //open modal to add game template
        $scope.newGameTemplate = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/new-modal.html",
                controller: "newGameTemplateModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.gameTemplates.unshift(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
   
        //open modal to edit game template
        $scope.editModal = function (id, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/edit-modal.html",
                controller: "editGameTemplateModalCtrl",
                inputs: {
                    gameId: id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.gameTemplates[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //delete game template
        $scope.delete = function (index, planId) {
            $http.delete("/simulation/games/remove/" + planId)
                .then(function(res){
                    $scope.gameTemplates.splice(index,1);
                    toastr.success('Game Template Deleted.', 'Success!');
                });
        };
    }
}());
