(function () {
    'use strict';
    angular.module('app')
    .controller('agendaPointsCtrl', ['$scope','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','AgendaPointService', ctrlFunction]);
    function ctrlFunction($scope,$filter, $location, $routeParams, $http, AuthService, ModalService, Query, AgendaPointService) {

        function init() {
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.agendaPointsTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            $scope.user = Query.getCookie('user');
            AgendaPointService.list($scope.user.userAccountId).then(function(response){
                $scope.agenda_points = response.data;
                $scope.sortByCreate = _.sortBy($scope.agenda_points, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.agenda_points = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
        };
    

        $scope.createModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/agenda-points/modal-form.html",
                controller: "agendaPointCreateCtrl",
                inputs : {
                    agendapoint: null,
                    categoryId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.agenda_points.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editModal = function(agendapoint ,index) {
            ModalService.showModal({
                templateUrl: "views/settings/agenda-points/modal-form.html",
                controller: "agendaPointCreateCtrl",
                inputs : {
                    agendapoint: agendapoint,
                    categoryId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result !== '' && result !== undefined){
                        $scope.agenda_points[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.linkTaskModal = function(agendapoint,index) {
            ModalService.showModal({
                templateUrl: "views/settings/agenda-points/task-link-modal.html",
                controller: "taskListModalCtrl",
                inputs : {
                    agendapoint : agendapoint,
                    actionPlanId : null,
                    incidentId: null,
                    selectedIncidentPlanId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if (result){
                        $scope.agenda_points[index] = result;
                        close(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deletelist = function (list, index){
            AgendaPointService.delete(list.id).then(function(res){
                console.log(res);
                if(res.data.success){
                    $scope.agenda_points.splice(index,1);
                    toastr.success("Delete successful");
                }else{
                    toastr.error("You cannot delete this agendapoint as being used somewhere.","Warning");
                }
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };

        init();

    }
}());
