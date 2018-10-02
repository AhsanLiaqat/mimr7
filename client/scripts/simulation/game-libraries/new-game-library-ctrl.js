(function () {
    'use strict';

    angular.module('app')
        .controller('newGameLibraryCtrl', ['$scope', '$http', '$timeout', 'Upload', 'close','ModalService','articleId','contentType', ctrlFunction]);

    function ctrlFunction($scope, $http, $timeout, Upload, close,ModalService,articleId, contentType) {
        //fetch initial data
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

        //close modal
        $scope.close = function(result) {
 	         close(result); // close, but give 500ms for bootstrap to animate
        };

        //save after edit
        $scope.submitLibraryRef = function () {
            if ($scope.lib.links != undefined){
            }
        	Upload.upload({
        		url: "/article-library/article-libraries/save" ,
        		data: $scope.lib
        	}).then(function (res) {
                $scope.lib = {};     
                $scope.close(res.data);
                toastr.success("Library Reference added successfully.")
            });
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
