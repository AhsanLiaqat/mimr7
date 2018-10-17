(function () {
    'use strict';

    angular.module('app')
        .controller('libEditCtrl', ['$scope', 'close', '$routeParams', '$http', 'Upload', '$timeout', 'id','LibraryService', editFunction]);

        function editFunction($scope, close, $routeParams, $http, Upload, $timeout, id, LibraryService) {
            $scope.close = function(result) {
 	            close(result); // close, but give 500ms for bootstrap to animate
            };
            
            $scope.init = function() {
                $scope.check = {};
                $scope.lib = {};
                LibraryService.get(id).then(function(res){
                    $scope.lib = res.data;
                    if($scope.lib.links != null){
                        $scope.check.link = true
                    }else{
                        $scope.check.file =true;
                    }
                    $scope.avatar = $scope.lib.filename;
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });                
                // var path = '/settings/libraries/get?id=' + id;
                // $http.get(path).then(function(res) {
                    
                // });
            };
            $scope.init();

            $scope.submitLibraryRef = function() {
                $scope.lib.filename = $scope.avatar;
                LibraryService.update($scope.lib).then(function(res){
                    toastr.success("Library Reference updated successfully.")
                    close($scope.lib);
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post("/settings/libraries/update" , { data: $scope.lib }).then(function (res) {
                    

                // });
            };

            $scope.uploadFiles = function(file, errFiles) {
                var avatar = file;
                if(avatar) {
                    avatar.upload = Upload.upload({
                        url: '/library/avatar',
                        data: { file: avatar }
                    });

                    avatar.upload.then(function (response) {
                        $timeout(function () {
                            $scope.avatar = response.data.path;
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }

		    };
        }
}());
