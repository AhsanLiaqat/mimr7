(function () {
    'use strict';

    angular.module('app')
        .controller('studentsDetailCtrl', ['$scope', '$location', '$filter', '$routeParams', '$http', 'AuthService','Query','OrganizationService','ModalService', ctrlFunction]);

    function ctrlFunction($scope, $location, $filter, $routeParams, $http, AuthService,Query, OrganizationService, ModalService) {

        function init() {
        }
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;

        $scope.studentTable = function (tableState) {
            $scope.isLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     
            var number = pagination.number || 10;  

            $scope.user = Query.getCookie('user');
            $http.get('/settings/organizations/get/' + $routeParams.OrgId).then(function(response) {
                $scope.organizations = response.data;
                $scope.sortByCreate = _.sortBy($scope.organizations.students, function (o) { return new Date(o.createdAt); });
                $scope.organizationsToShow = $scope.sortByCreate.reverse();

                $scope.a = _.sortBy($scope.organizationsToShow, function (o) { return new Date(o.name); });

                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.organizationsToShow = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            });
        };

        $scope.addStudent = function() {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-student-form.html",
                controller: "newStudentCtrl",
                inputs : {
                    studentId : null,
                    organizationId : $scope.organizations.id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.organizationsToShow.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editStudent = function(record,index) {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-student-form.html",
                controller: "newStudentCtrl",
                inputs : {
                    studentId : record.id,
                    organizationId : $scope.organizations.id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        console.log('result',result)
                        $scope.organizationsToShow[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteStudent = function (id, index) {
            $http.delete('/settings/students/remove/' + id)
                .then(function(res){
                   $scope.organizationsToShow.splice(index, 1);
                });
        };

        $scope.dateFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };


        init();

    }

}());
