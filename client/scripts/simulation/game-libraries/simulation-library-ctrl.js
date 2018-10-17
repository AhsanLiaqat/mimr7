(function () {
    'use strict';

    angular.module('app')
    .controller('simulationLibraryCtrl', [ '$scope', '$timeout', '$location', 'ModalService', '$uibModal', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams', libraryFunc]); 
    
    function libraryFunc($scope, $timeout, $location, ModalService, $uibModal, $filter, $http, $rootScope, $route, AuthService,$routeParams) {


        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]

        $scope.pageItems = 10;
        $scope.selected = 0;
        $http.post('/article-library/article-libraries/all/' + $routeParams.gamePlanId)
        .then(function(res){
            $scope.media = res.data;
        });

        // fetch and set initial data
        $scope.referencesTable = function (tableState) {
            $scope.selectoptions = []; 
            $scope.selectoptions.push({id: 0,name: 'All Game Templates'});
            $scope.libraryToShow = []
            $scope.isLoading = true;
            $scope.tableState = tableState;
            // $http.get("/simulation/game-libraries/all").then(function(response) {
            //     $http.get('/simulation/games/all').then(function (resp) {
            //         $scope.gameTemplates = resp.data;
            //         angular.forEach($scope.gameTemplates, function(value) {
            //           $scope.selectoptions.push(value);
            //         });
            //         $scope.libReferences = response.data;
            //         $scope.isLoading = false;
            //         angular.forEach($scope.libReferences, function(value) {
            //           value.gameTemplate = $filter('filter')($scope.gameTemplates, { id: value.gamePlanId})[0]
            //         });
            //         $scope.isLoading = false;
            //         $scope.libraryToShow =  angular.copy($scope.libReferences);
            //         if($routeParams.gamePlanId){
            //             $scope.gameIdFound = true;
            //             $scope.selected = $routeParams.gamePlanId;
            //         }
            //         $scope.managearray($scope.selected);
            //     });
            // });
        };

        // dp pagination
        $scope.paginate = function(arr){
            $scope.sortByCreate = _.sortBy(arr, function (o) { return new Date(o.createdAt); });
            $scope.a = $scope.sortByCreate.reverse();
            $scope.total = arr.length;
            var tableState = $scope.tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var number = pagination.number || 10;
            var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;

            if (tableState.sort.predicate) {
                filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
            }
            var result = filtered.slice(start, start + number);
            tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
            return result;
                    
        }

        //filter data to show on basis of gamePlanId
        $scope.managearray = function(id){
            if(id == 0){
                $scope.libraryToShow =  angular.copy($scope.libReferences);
            }else{
                $scope.libraryToShow = []
                angular.forEach($scope.libReferences, function(value) {
                  if(value.gamePlanId == id){
                    $scope.libraryToShow.push(value);
                  }
                });
            }
            $scope.libraryToShow = $scope.paginate($scope.libraryToShow);
        }

        //add media
        $scope.addModal = function() {
            var inputs = {
                id: null,
                articleId: $routeParams.gamePlanId,
                contentType : 'article-library',
                messageId : null
            };
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs: inputs
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.media.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };


        $scope.callAtTimeout = function(id, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
                controller: "newGameLibraryCtrl",
                inputs:{
                    id: id,
                    articleId: null,
                    contentType : null,
                    messageId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.media[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        
        //show image type media
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
        
        //show pdf type media
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
        
        //show video type media
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
        
        //show and categorize media
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

        //delete media
        $scope.deleteModal = function(id,index) {
            $http.delete('/article-library/article-libraries/remove/' + id).then(function(res) {
                toastr.success("Delete successful");
                $scope.media.splice(index,1);
            });
        };

        //provide short url 
        $scope.shortUrl = function (url) {
            if (url.indexOf('https') !== -1){
                return url.replace('https://','');
            }else if(url.indexOf('http') !== -1){
                return url.replace('http://','');
            }else{
                return url
            }
        };

    }

}());
