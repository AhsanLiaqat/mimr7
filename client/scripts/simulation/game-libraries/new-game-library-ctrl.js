(function () {
    'use strict';

    angular.module('app')
        .controller('newGameLibraryCtrl', ['$scope', '$http', '$timeout', 'Upload', 'close','ModalService','articleId','contentType','id','messageId', ctrlFunction]);

    function ctrlFunction($scope, $http, $timeout, Upload, close,ModalService,articleId, contentType,id , messageId) {
        //fetch initial data
        $scope.id = id;
        if(contentType == 'article-library'){
            $scope.lib = {
                parentId: articleId,
                parentType : 'Article'
            };
        }else{
            $scope.lib = {
                parentId: messageId,
                parentType : 'Message'
            };
        }
        $scope.init = function() {
            $scope.check = {};
            if(id){
                var path = '/article-libraries/get?id=' + id;
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
            }
        };
        $scope.init();

        //close modal
        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };

        //save after edit
        $scope.submitLibraryRef = function () {
            if ($scope.lib.links != undefined){
            }
            if(messageId){
                Upload.upload({
                    url: "/messages/save-libraries" ,
                    data: $scope.lib
                }).then(function (res) {
                    $scope.lib = {};     
                    $scope.close(res.data);
                    toastr.success("Library Reference added successfully.")
                });
            }else{
                if(id){
                    console.log('-------');
                    $scope.lib.filename = $scope.avatar;
                    $http.post("/article-libraries/update" , { data: $scope.lib }).then(function (res) {
                        close(res.data);
                    });
                }else{
                	Upload.upload({
                		url: "/article-libraries/save" ,
                		data: $scope.lib
                	}).then(function (res) {
                        $scope.lib = {};     
                        $scope.close(res.data);
                    });
                }
            }
        };

        //add media
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
					avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			}

		}
    }


}());
