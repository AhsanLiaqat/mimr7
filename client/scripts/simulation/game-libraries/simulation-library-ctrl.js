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

        var setSocketForMedia = function(){
            $timeout(function () {
                SOCKET.on('incoming_media:'+$routeParams.gamePlanId, function (response) {
                    var data = response.data;
                    if(response.action == "new"){
                        console.log("incoming_message new------",data);
                        $scope.messageToShow.push(data);
                        toastr.success("New media added successful.");
                    }else if(response.action == "update"){
                        console.log("incoming_message update",data);
                        for(var i = 0; i < $scope.messageToShow.length; i++){
                            if($scope.messageToShow[i].id == data.id){
                                $scope.messageToShow[i] = data;
                                toastr.success("Media Updated Successfully");
                            }
                        }
                    }else if(response.action == "delete"){
                        console.log("incoming_message delete",data);
                        for(var i = 0; i < $scope.messageToShow.length; i++){
                            if($scope.messageToShow[i].id == data.id){
                                $scope.messageToShow.splice(i,1);
                                toastr.success("Media Deleted Successfully");
                            }
                        }
                    }else {
                        toastr.error("Something went wrong!");
                        console.log("incoming_message --> does not match any action incident_class socket.",response);
                    }
                    // $scope.messages = Query.sort($scope.messages,'createdAt',true);
                    $scope.$apply();
                });
            });
        };

        function init(){
            $scope.referencesTable = function (tableState) {
                $scope.selectoptions = []; 
                $scope.selectoptions.push({id: 0,title: 'All'});
                $scope.libraryToShow = []
                $scope.isLoading = true;
                $scope.tableState = tableState;

                $http.post('/article-libraries/all?id=' + $routeParams.gamePlanId).then(function(response) {
                    $http.get('/articles/all').then(function (resp) {
                        $scope.gameTemplates = resp.data;
                        angular.forEach($scope.gameTemplates, function(value) {
                          $scope.selectoptions.push(value);
                        });
                        $scope.messages = response.data;
                        $scope.isLoading = false;
                        $scope.messages =  angular.copy($scope.messages);
                        if($routeParams.gamePlanId){
                            $scope.gameIdFound = true;
                            $scope.selected = $routeParams.gamePlanId;
                        }
                        $scope.messageToShow =  angular.copy($scope.messages);
                        // $scope.managearray($scope.selected);
                    });
                });
            };
            setSocketForMedia();
        }


        $scope.managearray = function(id){
            console.log('--=-=--=-=-=-=-=-',id)
            if(id == 0){
                $http.post('/article-libraries/all').then(function (response) {
                    console.log('==================',response.data);
                    $scope.allMessages = response.data;
                    $scope.messageToShow =  angular.copy($scope.allMessages);
                });
            }else{
                $scope.messageToShow = [];
                $http.post('/article-libraries/all?id=' + id).then(function (response) {
                    $scope.articleMessage = response.data;
                    angular.forEach($scope.articleMessage, function(value) {
                        if(value.parentId == id){
                            $scope.messageToShow.push(value);
                        }
                    });
                });
            }
            // $scope.messageToShow = $scope.paginate($scope.messageToShow);
        }

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
                    // if(result){
                    //     $scope.media.push(result);
                    // }
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
                    // if(result){
                    //     $scope.media[index] = result;
                    // }
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
            $http.delete('/article-libraries/remove/' + id).then(function(res) {
            });
        };

        init();  

    }

}());
