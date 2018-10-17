(function () {
    'use strict';

    angular.module('app')
        .controller('modalLibraryCtrl', ['$scope', '$http', '$timeout', 'close','LibraryService', ctrlFunction]);

    function ctrlFunction($scope, $http, $timeout, close, LibraryService) {
        $scope.lib = {}
        $scope.close = function(result) {
 	         close(result); // close, but give 500ms for bootstrap to animate
        };
        $scope.uploadpls =function(){
            LibraryService.save($scope.lib).then(function(res){
                console.log('++++++++++',res);
                $scope.lib = '';
                $scope.close();
                toastr.success("Library Reference added successfully.")
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // Upload.upload({
            //  url: "/settings/libraries/save" ,
            //  data: $scope.lib
            // }).then(function (res) {
                
            // });
        }
        $scope.submitLibraryRef = function () {
            if($scope.lib && $scope.lib.title){
                if($scope.check && $scope.check.file && $scope.lib.links){
                    delete $scope.lib.links
                }else if($scope.check && $scope.check.link && $scope.lib.file){
                    delete $scope.lib.links
                }
                if($scope.check && $scope.check.link){
                    if($scope.lib.links && !$scope.lib.links == ""){
                        $scope.uploadpls();
                    }else{
                        toastr.warning('Please enter some link.');
                    }
                }else if($scope.check && $scope.check.file){
                    if($scope.lib.file){
                         $scope.uploadpls();
                    }else{
                	   toastr.warning('Please select some file.');
                    }
                }else{
                    toastr.warning('Please select link or file.');
                }
            }else{
                toastr.warning('Please fill required fields.');
            }
        };
    }


}());
