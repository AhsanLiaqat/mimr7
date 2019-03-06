(function () {
    'use strict';

    angular.module('app')
    .controller('QuestionCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {
        $scope.valid = false;
        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.selectoptions = [];
        $scope.messageToShow = [];

        function init() {

            $scope.QuestionsTable = function (tableState) {
                $scope.isLoading = true;
                $scope.tableState = tableState;
                $scope.user = Query.getCookie('user');
                $http.get('/questions/all-questions').then(function (respp) {
                    $scope.questions = respp.data;
                    $scope.isLoading = false;
                    $scope.questions = $scope.paginate($scope.questions);
                });
            };
        }

        // do pagination
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

        $scope.addQuestions = function() {
            ModalService.showModal({
                templateUrl: "views/content-libraries/question.html",
                controller: "newQuestionCtrl",
                inputs : {
                    questionId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.questions.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editQuestion = function(record,index) {
            ModalService.showModal({
                templateUrl: "views/content-libraries/question.html",
                controller: "newQuestionCtrl",
                inputs : {
                    questionId : record.id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.questions[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteQuestion = function (id, index) {
            $http.delete("/questions/delete/" + id)
                .then(function(res){
                   $scope.questions.splice(index, 1);
                });
        };

        init();

    }


}());
