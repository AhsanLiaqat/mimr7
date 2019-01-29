(function () {
    'use strict';

    angular.module('app')
        .controller('newMediaLibraryCtrl', ['$scope', '$http', '$timeout', 'Upload', 'close','ModalService','record','contentType','parentId', ctrlFunction]);

    function ctrlFunction($scope, $http, $timeout, Upload, close,ModalService,record, contentType, parentId) {
        //fetch initial data
        $scope.init = function() {
            $scope.parentId = parentId;
            if(record && Object.keys(record).length > 0){
                $scope.lib = angular.copy(record);
            }else{
                $scope.lib = {parentId: parentId};
            }
            $scope.lib.kind = contentType;
            if(contentType == 'article-library'){
                $scope.lib.parentType = 'Article';
            }else{
                $scope.lib.parentType = 'Message';
            }
            $scope.check = {};
            if($scope.lib.type != null){
                $scope.check.file =true;
            }else{
                $scope.check.link = true
            }
            $scope.avatar = $scope.lib.filename;
            $scope.getMessageAndArtcile($scope.lib.kind);
        };

        //close modal
        $scope.close = function(result) {
             close(result); // close, but give 500ms for bootstrap to animate
        };

        //save after edit
        $scope.submitLibraryRef = function () {
            if ($scope.lib.links != undefined){
            }
            if($scope.lib.id){
                if(contentType == 'article-library'){
                    $scope.lib.filename = $scope.avatar;
                    $http.post("/article-libraries/update" , { data: $scope.lib }).then(function (res) {
                        close(res.data);
                    });
                }else{
                    // Upload.upload({
                    //     url: "/messages/save-libraries" ,
                    //     data: $scope.lib
                    // }).then(function (res) {
                    //     $scope.lib = {};     
                    //     $scope.close(res.data);
                    //     toastr.success("Library Reference added successfully.")
                    // });
                }
            }else{
               if(contentType == 'article-library'){
                    Upload.upload({
                        url: "/article-libraries/save" ,
                        data: $scope.lib
                    }).then(function (res) {
                        $scope.lib = {};     
                        $scope.close(res.data);
                    });
                }else{
                    Upload.upload({
                        url: "/messages/save-libraries" ,
                        data: $scope.lib
                    }).then(function (res) {
                        $scope.lib = {};     
                        $scope.close(res.data);
                        toastr.success("Library Reference added successfully.")
                    });
                } 
            }
        };
        $scope.getMessageAndArtcile = function(type){
            if(type == "article-library"){
                $scope.lib.parentType = 'Article';
                $http.get('/articles/all').then(function (resp) {
                    $scope.records = resp.data;
                    angular.forEach($scope.records, function(value,ind) {
                        value.show = value.title;
                    });
                });
            }else{
                $scope.lib.parentType = 'Message';
                $http.get('/messages/all?id=All Messages').then(function (respp) {
                    $scope.records = respp.data;
                    angular.forEach($scope.records, function(value,ind) {
                        value.show = value.content;
                    });
                });
            }
        }

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
        $scope.init();
    }


}());
