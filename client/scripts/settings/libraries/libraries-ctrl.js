(function () {
    'use strict';

    angular.module('app')
    .controller('libraryCtrl', [ '$scope', '$timeout', '$location', 'ModalService', '$uibModal', '$filter', '$http', '$rootScope', '$route', 'AuthService','LibraryService', libraryFunc]); 

    function libraryFunc($scope, $timeout, $location, ModalService, $uibModal, $filter, $http, $rootScope, $route, AuthService, LibraryService) {

        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]

        $scope.pageItems = 10;

        $scope.referencesTable = function (tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;

            LibraryService.all().then(function(response){
                $scope.libReferences = response.data;
                $scope.sortByCreate = _.sortBy($scope.libReferences, function (o) { return new Date(o.createdAt); });
                $scope.a = $scope.sortByCreate.reverse();
                $scope.total = response.data.length;
                var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

                if (tableState.sort.predicate) {
                    filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                var result = filtered.slice(start, start + number);
                $scope.libReferences = result;
                tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
                $scope.isLoading = false;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get("/settings/libraries/all").then(function(response) {
                
            // });
        };

        $scope.openModal = function(id) {
            ModalService.showModal({
                templateUrl: "views/settings/libraries/form.html",
                controller: "modalLibraryCtrl"
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                     $('.modal-backdrop').remove();
                     $('body').removeClass('modal-open');
                     $scope.referencesTable($scope.tableState);
                });
            });
        };

        $scope.viewModalTimeout = function(id) {
             ModalService.showModal({
                templateUrl: "views/settings/libraries/form.html",
                controller: "libViewCtrl",
                inputs: {
                    id: id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                     $('.modal-backdrop').remove();
                     $('body').removeClass('modal-open');
                     $scope.referencesTable($scope.tableState);
                });
            });
        };

        $scope.callAtTimeout = function(id, index) {
            ModalService.showModal({
                templateUrl: "views/settings/libraries/form.html",
                controller: "libEditCtrl",
                inputs:{
                    id: id
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                     $('.modal-backdrop').remove();
                     $('body').removeClass('modal-open');
                     $scope.referencesTable($scope.tableState);
                });
            });
        };

        var imageModal = function(record){
        	$uibModal.open({
        	      templateUrl: 'views/settings/libraries/lib-image.html',
        	      size: 'lg',
        	      windowClass: 'image-modal' + record.id,
        	      controller: function($scope, $uibModalInstance) {
        	    	  var self = this;
        	        $scope.record = record;
        	        $scope.size = 100;
        	        $scope.maximized = false;
        	        var getWindow = function(){
        	        	if (!self.window){
        	        		self.parent = angular.element('.image-modal' + record.id);
        	        		self.window = self.parent.find('.modal-dialog');
        	        	}
        	        	return self.window;
        	        };
        	        $scope.maximize = function(){
        	        	var win = getWindow();
        	        	self.parent.addClass('max');
        	        	$scope.maximized = true;
        	        };
        	        $scope.restore = function(){

        	        	var win = getWindow();
        	        	self.parent.removeClass('max');
        	        	$scope.maximized = false;
        	        };
        	        $scope.close = function(){
        	        	$uibModalInstance.close();
        	        }
        	        $scope.zoom = function(dir){
        	        	switch(dir){
        	        		case 'in':
        	        			$scope.size += 5;
        	        			break;
        	        		case 'out':
        	        			$scope.size -= 5;
        	        			break;
        	        	}
        	        }
        	      }
        	});
        };

        var pdfModal = function(record){
        	$uibModal.open({
        	      templateUrl: 'views/settings/libraries/lib-pdf.html',
        	      size: 'lg',
        	      windowClass: 'pdf-modal pdf-modal' + record.id,
        	      controller: function($scope, $uibModalInstance, $sce) {
        	    	  var self = this;
        	        $scope.record = record;
        	        $scope.size = 100;
        	        $scope.url = $sce.trustAsResourceUrl(record.url);
        	        $scope.maximized = false;
        	        var getWindow = function(){
        	        	if (!self.window){
        	        		self.parent = angular.element('.pdf-modal' + record.id);
        	        		self.window = self.parent.find('.modal-dialog');
        	        	}
        	        	return self.window;
        	        };
        	        $scope.maximize = function(){
        	        	var win = getWindow();
        	        	self.parent.addClass('max');
        	        	$scope.maximized = true;
        	        };
        	        $scope.restore = function(){
        	        	var win = getWindow();
        	        	self.parent.removeClass('max');
        	        	$scope.maximized = false;
        	        };
        	        $scope.close = function(){
        	        	$uibModalInstance.close();
        	        }

        	      }
        	});
        };

        var videoModal = function(record, size){
        	$uibModal.open({
        	      templateUrl: 'views/settings/libraries/lib-video.html',
        	      size: size,
        	      windowClass: 'video-modal' + record.id,
        	      controller: function($scope, $uibModalInstance, $sce, $window) {
        	    	var self = this;
        	        $scope.record = record;
        	        $scope.maximize = function(){
        	        	$scope.API.toggleFullScreen();
        	        };
        	        $scope.restore = function(){
        	        	$scope.API.toggleFullScreen();
        	        };
        	        $scope.close = function(){
        	        	$uibModalInstance.close();
        	        }
        	        $scope.API = null;
        	        $scope.onPlayerReady = function(API) {
        				$scope.API = API;
        			};
        	        $scope.config = {
        					sources: [
        						{src: $sce.trustAsResourceUrl(record.url), type: record.mimetype},
        					],
        					theme: "bower_components/videogular-themes-default/videogular.css"
        				};
        	      }
        	});
        };

        $scope.preview = function(record){
        	switch (record.type){
        		case "image":
        			imageModal(record);
        			break;
        		case "video":
        			videoModal(record, 'lg');
        			break;
        		case "pdf":
        			pdfModal(record);
        			break;
        		case "audio":
        			videoModal(record, 'md');
        			break;
        	}
        };

        $scope.deleteModal = function(id) {
            LibraryService.delete(id).then(function(res){
                toastr.success("Delete successful");
                $scope.referencesTable($scope.tableState);
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/settings/libraries/remove", {id: id}).then(function(res) {
                
            // });
        };

        $scope.shortUrl = function (url) {
            if(url){
                if (url.indexOf('https') !== -1){
                    return url.replace('https://','');
                }else if(url.indexOf('http') !== -1){
                    return url.replace('http://','');
                }else{
                    return url
                }
            }
        };

    }

}());
