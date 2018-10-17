(function () {
    'use strict';

    angular.module('app')
    .controller('DynamicFormsCtrl', ['$scope','$filter', '$location', '$routeParams', '$http', 'AuthService', 'ModalService', 'Query','DynamicFormService', ctrlFunction]);

    function ctrlFunction($scope,$filter, $location, $routeParams, $http, AuthService, ModalService, Query, DynamicFormService) {
        var init = function(){
            $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]
            $scope.pageItems = 10;
        }

        $scope.dynamicFormsTable = function (tableState) {
            $scope.isLoading = true;
            $scope.user = Query.getCookie('user');
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            DynamicFormService.all($scope.user.userAccountId).then(function(response){
                $scope.dynamicForms = response.data;
                $scope.sortByCreate = _.sortBy($scope.dynamicForms, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.dynamicForms = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // var path = "/dynamic-form/all?userAccountId=" + $scope.user.userAccountId ;
            // $http.get(path).then(function(response) {
                
            // });
        };
        $scope.newForm = {
            name: "",
            heading: "",
            formTypeId: "",
            fields: []
        };
        $scope.openModal = function(form,index) {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/form.html",
                controller: "dynamicFormCreateCtrl",
                inputs : {
                    dynamicForm: form
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        if(form.id){
                            $scope.dynamicForms[index] = result;
                        }else{
                            // result.fields = JSON.parse(result.fields)
                            $scope.dynamicForms.push(result);
                        }
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }
        $scope.formTypes = function() {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/form-types.html",
                controller: "dynamicFormTypeCtrl",
                inputs : {
                    message: null,
                    dynamicForm: undefined
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        // result = JSON.parse(result)
                        result.obj = JSON.parse(result.obj)
                        console.log('=======',result);
                        $scope.dynamicForm.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        }

        $scope.view = function(form) {
            ModalService.showModal({
                templateUrl: "views/dynamic-form/view.html",
                controller: "dynamicFormViewCtrl",
                inputs : {
                    sender: $scope.user,
                    record: 'user',
                    dynamicForm: form,
                    detailed : true,
					tableInfo: undefined
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteForm = function (form,index){
            var id = form.id;
            DynamicFormService.delete(id).then(function(res){
                toastr.success("Delete successful");
                $scope.dynamicForms.splice(index,1);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/dynamic-form/remove", {id: id}).then(function(res) {
                
            // });
        }

        $scope.dateFormat = function(dat) {
            return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        };
        init();
    }
}());
