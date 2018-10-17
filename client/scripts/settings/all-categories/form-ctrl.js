(function () {
    'use strict';

    angular.module('app')
    .controller('categoryCreateCtrl', ['$scope', 'close', '$location', '$routeParams', '$http', 'AuthService', 'category','AllCategoryService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, $http, AuthService, category, AllCategoryService) {

        function init() {
            if(category !== null) {
                $scope.category = category;
                $scope.heading = 'Edit Category';
            }else{
                $scope.category = {};
                $scope.heading = 'Create New Category';
            }
        }

        $scope.submit = function() {
            if($scope.validate()){
                AllCategoryService.create($scope.category).then(function(response){
                    toastr.success("Category created successfully!");
                    close(response.data);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/settings/all-categories/save', {data: $scope.category}).then(function(response) {

                // });
            }else{
                toastr.error("Please fill the required fields!");
            }
        }

        $scope.validate = function(){
            if(($scope.category.name == undefined || $scope.category.name === "") ){
                return false;
            }else{
                if( $scope.category.position === "" || $scope.category.position == undefined){
                    return false;
                }else{
                    return true;
                }
            }
        }

        $scope.close = function() {
            close();
        }
        init();
    }
}());
