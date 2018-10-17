(function () {
    'use strict';

    angular.module('app')
        .controller('teamCtrl', ['$scope', '$routeParams', '$filter','$http', 'AuthService', 'ModalService', '$location','IncidentTeamService', teamFunction]);

        function teamFunction($scope, $routeParams,$filter, $http, AuthService, ModalService, $location, IncidentTeamService) {

            function init() {
                IncidentTeamService.all().then(function(response){
                    $scope.teams = response.data;
                    $scope.sortByCreate = _.sortBy($scope.teams, function (o) { return new Date(o.createdAt); });
                    $scope.teams = $scope.sortByCreate.reverse();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/incident-teams/all').then(function(response) {
                    
                // });
            }
            $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;

            $scope.Teamtable = function (tableState) {
                $scope.isLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                IncidentTeamService.all().then(function(response){
                    $scope.teams = response.data;
                    $scope.sortByCreate = _.sortBy($scope.teams, function (o) { return new Date(o.createdAt); });
                    $scope.a = $scope.sortByCreate.reverse();
                    $scope.total = response.data.length;
                    var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
                    if (tableState.sort.predicate) {
                        filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                    }
                    var result = filtered.slice(start, start + number);
                    $scope.teams = result;
                    tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                    $scope.isLoading = false;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get('/settings/incident-teams/all').then(function(response) {
                    
                // });
            };
            $scope.viewModal = function (team) {
                ModalService.showModal({
                    templateUrl: "views/settings/incident-teams/view.html",
                    controller: "teamViewCtrl",
                    inputs: {
                        team: team
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            }
            $scope.deleteTeam = function(index,id) {
                var data = {};
                data.id = id;
                data.status = false;
                IncidentTeamService.delete(data.id).then(function(res){
                    toastr.success("Incident Team deleted successfully.");
                    $scope.teams.splice(index,1)
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/settings/incident-teams/remove", {data: data}).then(function(res){
                    
                //  });
            };
            $scope.memberlength = function(team){
                return team.users.length;
            }

            init();
        }
}());
