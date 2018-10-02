
(function () {
    'use strict';

    angular.module('app')
        .controller('gameLibEditCtrl', ['$scope', 'close', '$routeParams', '$http', 'Upload', '$timeout', 'id', editFunction]);

        function editFunction($scope, close, $routeParams, $http, Upload, $timeout, id) {
            $scope.close = function(result) {
 	            close(result); // close, but give 500ms for bootstrap to animate
            };
            $http.get('/simulation/games/all').then(function (resp) {
                $scope.gameTemplates = resp.data;
            });

            //get and fetch initial data
            $scope.init = function() {
                $scope.check = {};
                var path = '/simulation/game-libraries/get?id=' + id;
                $scope.lib = {};
                $http.get(path).then(function(res) {
                    $scope.lib = res.data;
                    if($scope.lib.type != null){
                        $scope.check.file =true;
                    }else{
                        $scope.check.link = true
                    }
                    $scope.avatar = $scope.lib.filename;
                });
            };
            $scope.init();

            // save after edit
            $scope.submitLibraryRef = function() {
                $scope.lib.filename = $scope.avatar;
                $http.post("/simulation/game-libraries/update" , { data: $scope.lib }).then(function (res) {
                    toastr.success("Game Library updated successfully.")
                    close($scope.lib);

                });
            };

            //
            $scope.uploadFiles = function(file, errFiles) {
                var avatar = file;
                if(avatar) {
                    avatar.upload = Upload.upload({
                        url: '/simulation/game-libraries/avatar',
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
