(function () {
    'use strict';

    angular.module('app')
        .controller('studentsDetailCtrl', ['$scope', '$location', '$filter', '$routeParams', '$http', 'AuthService','Query','OrganizationService','ModalService', ctrlFunction]);

    function ctrlFunction($scope, $location, $filter, $routeParams, $http, AuthService,Query, OrganizationService, ModalService) {

        
        $scope.items = [{name: '10 items per page', val: 10},
        {name: '20 items per page', val: 20},
        {name: '30 items per page', val: 30},
        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.selectoptions = [];
        $scope.studentToShow = [];

        function init() {
            $scope.studentTable = function (tableState) {
                $scope.selectoptions.push({id: 0,name: 'All'});
                $scope.tableState = tableState;
                $scope.user = Query.getCookie('user');
                $scope.isLoading = true;
                $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function(response) {
                    $scope.org = response.data;
                    var params = 'id=';
                    if($routeParams.OrgId){
                        params += $routeParams.OrgId;
                    }else{
                        params += 'All Students';
                    }
                    $http.get('/settings/students/all?' + params).then(function (respp) {
                        $scope.selectoptions = $scope.selectoptions.concat($scope.org);
                        $scope.students = respp.data;
                        angular.forEach($scope.students , function(user){
                            user.answerQuestions = 0;
                            angular.forEach(user.question_schedulings,function(item){
                                if(item.answer){
                                    user.answerQuestions++;
                                }
                            });
                        });
                        $scope.students = _.sortBy($scope.students, function (o) { return new Date(o.name); });
                        $scope.isLoading = false;
                        if($routeParams.OrgId){
                            $scope.orgIdFound = true;
                            $scope.selected = $routeParams.OrgId;
                        }
                        $scope.studentToShow =  angular.copy($scope.students);
                        $scope.managearray($scope.selected);
                    });
                });
            };
        }


        $scope.paginate = function(arr){
            $scope.a = _.sortBy(arr, function (o) { return new Date(o.name); });
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

        $scope.managearray = function(id){
            if(id == 0){
                $scope.studentToShow =  angular.copy($scope.students);
            }else{
                $scope.studentToShow = Query.filter($scope.students , {organizationId: $scope.selected},false);
            }
            $scope.studentToShow = $scope.paginate($scope.studentToShow);
        }
        init();

        $scope.addStudent = function() {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-student-form.html",
                controller: "newStudentCtrl",
                inputs : {
                    studentId : null,
                    organizationId : $routeParams.OrgId || $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.studentToShow.push(result);
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
                    organizationId : $routeParams.OrgId || $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.studentToShow[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteStudent = function (id, index) {
            $http.delete('/settings/students/remove/' + id)
                .then(function(res){
                   $scope.studentToShow.splice(index, 1);
                });
        };

        $scope.dateFormat = function(dat){
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };


        init();

    }

}());
