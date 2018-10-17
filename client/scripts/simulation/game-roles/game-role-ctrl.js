(function () {
    'use strict';

    angular.module('app')
        .controller('gameRoleCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', gameRoleCtrl]);

    function gameRoleCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location) {
        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.roleToShow = [];

        //fetch and get initial data
        $scope.rolesTable = function (tableState) {
            $scope.isLoading = true;
            $scope.selectoptions = [];
            $scope.selectoptions.push({id: 0,name: 'All Game Templates'});
            $scope.tableState = tableState;
            $http.get('/simulation/game-roles/all').then(function (response) {
                $http.get('/simulation/games/all').then(function (resp) {
                    $scope.gameTemplates = resp.data;
                    angular.forEach($scope.gameTemplates, function(value) {
                      $scope.selectoptions.push(value);
                    });
                    $scope.roles = response.data;
                    $scope.isLoading = false;
                    angular.forEach($scope.roles, function(value) {
                      value.gameTemplate = $filter('filter')($scope.gameTemplates, { id: value.gamePlanId})[0]
                    });
                    $scope.roleToShow =  angular.copy($scope.roles);
                    if($routeParams.gamePlanId){
                        $scope.gameIdFound = true;
                        $scope.selected = $routeParams.gamePlanId;
                    }
                    $scope.managearray($scope.selected);
                });
            });
        };

        // do pagination
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
            return result;
        }

        //opens modal to show given role info
        $scope.roleInfo = function (role) { // tick
            ModalService.showModal({
                templateUrl: "views/actionPlanDashboard/task-info-modal.html",
                controller: "taskInfoModalCtrl",
                inputs: {
                    activity: role,
                    showEditButton: false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //filter roles on basis of gamePlanId
        $scope.managearray = function(id){
            if(id == 0){
                $scope.roleToShow =  angular.copy($scope.roles);
            }else{
                $scope.roleToShow = []
                angular.forEach($scope.roles, function(value) {
                  if(value.gamePlanId == id){
                    $scope.roleToShow.push(value);
                  }
                });
            }
            $scope.roleToShow = $scope.paginate($scope.roleToShow);
        }

        // opens modal to create new role
        $scope.CreateGameRole = function () {
            if($scope.gameIdFound){
                ModalService.showModal({
                    templateUrl: "views/simulation/game-roles/form.html",
                    controller: "newGameRoleModalCtrl",
                    inputs: {
                        role: null,
                        gamePlanId: $scope.selected,
                        gamePlanTeamId: null,
                        sequence: true
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result && result !== '') {
                            $scope.rolesTable($scope.tableState);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/game-roles/form.html",
                    controller: "newGameRoleModalCtrl",
                    inputs: {
                        role: null,
                        gamePlanId: null,
                        gamePlanTeamId: null,
                        sequence: true
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result && result !== '') {
                            $scope.rolesTable($scope.tableState);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
        };

        // opens modal to edit given role
        $scope.editRole = function (role, index) {
            if($scope.gameIdFound){
                ModalService.showModal({
                    templateUrl: "views/simulation/game-roles/form.html",
                    controller: "newGameRoleModalCtrl",
                    inputs: {
                        role: role,
                        gamePlanId: $scope.selected,
                        gamePlanTeamId: null,
                        sequence: true
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result && result !== '') {
                            $scope.rolesTable ($scope.tableState);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }else{
                ModalService.showModal({
                    templateUrl: "views/simulation/game-roles/form.html",
                    controller: "newGameRoleModalCtrl",
                    inputs: {
                        role: role,
                        gamePlanId: null,
                        gamePlanTeamId: null,
                        sequence: true
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        if (result && result !== '') {
                            $scope.rolesTable ($scope.tableState);
                        }
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
        };

        // deletes given role
        $scope.deleteRole = function (roleId, index) {
            $http.delete("/simulation/game-roles/remove/" + roleId)
                .then(function(res){
                    // $scope.roles.splice(index,1);
                    $scope.rolesTable ($scope.tableState);
                    toastr.success('Role deleted.', 'Success!');
                });
        };
    }
}());
