(function () {
    'use strict';

    angular.module('app')
        .controller('newGameLibraryCtrl', ['$scope', '$http', '$timeout', 'Upload', 'close','ModalService','gamePlanId', ctrlFunction]);

    function ctrlFunction($scope, $http, $timeout, Upload, close,ModalService,gamePlanId) {
        //fetch initial data
        $http.get('/simulation/games/all').then(function (response) {
            $scope.gameTemplates = response.data;
        });
        $scope.gamePlanId = gamePlanId;
        $scope.lib = {gamePlanId: gamePlanId};

        //close modal
        $scope.close = function(result) {
 	         close(result); // close, but give 500ms for bootstrap to animate
        };

        //save after edit
        $scope.submitLibraryRef = function () {
            if ($scope.lib.links != undefined){
            }
        	Upload.upload({
        		url: "/simulation/game-libraries/save" ,
        		data: $scope.lib
        	}).then(function (res) {
                $scope.lib = {};     
                $scope.close(res.data);
                toastr.success("Library Reference added successfully.")
            });
        };

        //opens modal to add new game template
        $scope.addGameTemplate = function () {
            ModalService.showModal({
                templateUrl: "views/simulation/game-template/add-game-template-name.html",
                controller: "createGameTemplateNameCtrl",
                inputs: {
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $http.get('/simulation/games/all').then(function (response) {
                        $scope.gameTemplates = response.data;
                    });
                    $('body').removeClass('modal-open');
                    if(result && result !== ''){

                    }
                });
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
