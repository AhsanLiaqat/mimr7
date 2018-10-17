(function () {
    'use strict';

    angular.module('app')
        .controller('libViewCtrl', ['$scope', 'close', '$routeParams', '$http','id','LibraryService', viewFunction]);

        function viewFunction($scope, close, $routeParams, $http, id, LibraryService) {
            $scope.close = function(result) {
 	            close(result); // close, but give 500ms for bootstrap to animate
            };

            // var path = '/settings/libraries/get?id=' + id;
            
            function init() {
                $scope.check = {};
                console.log("The init function");
                $scope.notEdit = true;
                LibraryService.get(id).then(function(res){
                    $scope.lib = res.data;
                    console.log($scope.lib);
                    if($scope.lib.mimetype != null){
                        $scope.check.file =true;
                    }else{
                        $scope.check.link = true
                    }
                    $scope.avatar = $scope.lib.filename;
                    $scope.notEdit = true;
                    if($scope.lib.type != undefined){
                        $scope.check.file = true;
                    }
                    if($scope.lib.type == undefined){
                        $scope.check.link = true;
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get(path).then(function(res) {                  
                    
                   
                // });
            }

            init();
        }

}());
