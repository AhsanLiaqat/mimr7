/*Content - Library*/
/*In this controller we add contents to articles*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
    .controller('collectionContentLibraryCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {
        $scope.valid = false;
        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.selectoptions = [];
        $scope.chaptersToShow = [];


        function init() {

            $scope.QuestionsTable = function (tableState) {
                
                $scope.selectoptions.push({id: 0,title: 'All'});
                $scope.isLoading = true;
                $scope.tableState = tableState;
                $scope.user = Query.getCookie('user');
                $http.get('/articles/all').then(function (resp) {
                    $scope.articles = resp.data;
                    $http.get('/chapters/all').then(function (respp) {
                        $scope.selectoptions = $scope.selectoptions.concat($scope.articles);
                        $scope.chapters = respp.data;
                        $scope.isLoading = false;
                        $scope.managearray($scope.selected);
                    });
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

        $scope.managearray = function(id){
            if(id == 0){
                $scope.chaptersToShow =  angular.copy($scope.chapters);
            }else{
                $scope.chaptersToShow = Query.filter($scope.chapters , {articleId: $scope.selected},false);
            }
            $scope.chaptersToShow = $scope.paginate($scope.chaptersToShow);
        }

        $scope.addContent = function() {
            ModalService.showModal({
                templateUrl: "views/content-libraries/add-modal-content.html",
                controller: "newContentCtrl",
                inputs : {
                    contentId : null,
                    articleId : $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.chaptersToShow.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editContent = function(record,index) {
            ModalService.showModal({
                templateUrl: "views/content-libraries/add-modal-content.html",
                controller: "newContentCtrl",
                inputs : {
                    contentId : record.id,
                    articleId : $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.chaptersToShow[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.viewContent = function(record) {
            ModalService.showModal({
                templateUrl: "views/content-libraries/view-content-modal.html",
                controller: "viewContentModalCtrl",
                inputs : {
                    content : record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        //deletes message
        $scope.deleteContent = function (id, index) {
            $http.delete("/chapters/delete/" + id)
                .then(function(res){
                   $scope.chaptersToShow.splice(index, 1);
                });
        };

        init();

    }


}());
