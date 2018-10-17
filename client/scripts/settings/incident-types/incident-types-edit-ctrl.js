(function () {
    'use strict';

    angular.module('app')
        .controller('incidentTypesEditCtrl', categoryCtrl);

        function categoryCtrl($scope, $filter, $http, $timeout, $location, $routeParams, ModalService,Query,DashboardCategoryService, CheckListService, IncidentTypeService) {

            function init() {
                $scope.posArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                $scope.data = {};
                $scope.user = Query.getCookie('user');
                $scope.data.userAccountId = $scope.user.userAccountId;
                $scope.allchecked = false;
                CheckListService.list($scope.user.userAccountId).then(function(response){
                    $scope.check_lists = response.data;
                    angular.forEach($scope.check_lists, function(value){
                        if(value.all_category){
                            value.full_name = value.name + " ( " + value.all_category.name + " )";
                        }else{
                            value.full_name = value.name
                        }
                    });
                    console.log($scope.check_lists);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = "/settings/check-lists/list?accountId=" + $scope.user.userAccountId;
                // $http.get(path).then(function (response) {
                    
                // });
                DashboardCategoryService.getAllCategories().then(function(res){
                    $scope.categories = res.data;
                    $scope.sortByCreate = _.sortBy($scope.categories, function (o) { return new Date(o.createdAt); });
                    $scope.categories = $scope.sortByCreate.reverse();
                    angular.forEach($scope.categories, function(value) {
                      value.checked = false;
                    });
                    if ($routeParams.cat_id) {
                        IncidentTypeService.item($routeParams.cat_id).then(function(res){
                            $scope.data = res.data;
                            $scope.editDCategories = [];
                            angular.forEach($scope.data.default_categories, function(value) {
                              $scope.editDCategories.push(value.id)
                            });
                            var arr = angular.copy($scope.data.default_categories);
                            $scope.data.default_categories = [];
                            angular.forEach(arr, function(value) {
                              $scope.data.default_categories.push(value.id);
                            });

                            var lists = []
                            angular.forEach($scope.data.checkLists, function(value) {
                                lists.push(value.id);
                            });
                            delete $scope.data.checkLists;
                            $scope.data.checkLists = lists;
                            console.log();
                            angular.forEach($scope.categories, function(value) {
                              angular.forEach($scope.data.default_categories, function(val) {
                                  if(value.id == val){
                                    value.checked = true;
                                  }
                                });
                            });
                            console.log($scope.categories,$scope.data.default_categories);
                            $scope.data.default_categories = [];
                            $scope.data.default_categories = $scope.editDCategories;
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.get("/settings/incident-types/item?id=" + $routeParams.cat_id).then(function(res) {
                            
                        // })
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/settings/dashboard-categories/all-categories").then(function(res){

                // });
            }

            $scope.createCategory = function(){
                ModalService.showModal({
                    templateUrl: "views/settings/dashboard-categories/form.html",
                    controller: "dashboardCategoriesFormCtrl",
                    inputs: {
                        category: null,
                        incidents: null
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                        if(result !== '' && typeof result !== 'undefined'){
                          $scope.categories.unshift(result);
                        }
                    });
                });
            }

            $scope.setPosition = function(data){
                DashboardCategoryService.setPosition(data).then(function(res){

                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/settings/dashboard-categories/set-position", {data: data}).then(function(res){
                // });
            }

            $scope.order = function(rowName) {
                if ($scope.row === rowName) {
                    return;
                }
                $scope.row = rowName;
                $scope.categories = $filter('orderBy')($scope.categories, rowName);
            };

            $scope.all = function(){
                if(!$scope.data.default_categories){
                    $scope.data.default_categories = [];
                }
                if ($scope.allchecked){
                    angular.forEach($scope.categories, function(value) {
                       $scope.data.default_categories.push(value.id);
                       value.checked = true;
                    });
                }else{
                    angular.forEach($scope.categories, function(value) {
                       value.checked = false;
                    });
                    $scope.data.default_categories = [];
                }
            }
            $scope.uncheck = function(cat){
                if(!$scope.data.default_categories){
                    $scope.data.default_categories = [];
                }
                if (cat.checked){
                    $scope.data.default_categories.push(cat.id);
                }else{
                    angular.forEach($scope.data.default_categories, function(value,key) {
                       if(value == cat.id){
                        $scope.data.default_categories.splice(key, 1);
                       }
                    });
                }
            }

            $scope.save = function() {
                if($scope.data.name != null){
                    IncidentTypeService.save($scope.data).then(function(){
                        $location.path("/settings/incident-types");
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // $http.post("/settings/incident-types/save", $scope.data).then(function() {
                        
                    // })
                }else{
                    toastr.error("please fill required fields");
                }
            };

            init();
        }
}());
