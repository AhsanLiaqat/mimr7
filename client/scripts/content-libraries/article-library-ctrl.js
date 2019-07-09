(function () {
    'use strict';

    angular.module('app')
    .controller('articleLibraryCtrl', [ '$scope', '$timeout', '$location', 'ModalService', '$uibModal', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', libraryFunc]); 
    
    function libraryFunc($scope, $timeout, $location, ModalService, $uibModal, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {


        $scope.items = [{name: '10 items per page', val: 10},
            {name: '20 items per page', val: 20},
            {name: '30 items per page', val: 30},
            {name: 'show all items', val: 30000}]

        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.selectoptions = [];
        $scope.messageToShow = [];

        // var setSocketForMedia = function(){
        //     $timeout(function () {
        //         SOCKET.on('incoming_media:'+$routeParams.gamePlanId, function (response) {
        //             var data = response.data;
        //             if(response.action == "new"){
        //                 console.log("incoming_message new------",data);
        //                 $scope.messageToShow.push(data);
        //                 toastr.success("New media added successful.");
        //             }else if(response.action == "update"){
        //                 console.log("incoming_message update",data);
        //                 for(var i = 0; i < $scope.messageToShow.length; i++){
        //                     if($scope.messageToShow[i].id == data.id){
        //                         $scope.messageToShow[i] = data;
        //                         toastr.success("Media Updated Successfully");
        //                     }
        //                 }
        //             }else if(response.action == "delete"){
        //                 console.log("incoming_message delete",data);
        //                 for(var i = 0; i < $scope.messageToShow.length; i++){
        //                     if($scope.messageToShow[i].id == data.id){
        //                         $scope.messageToShow.splice(i,1);
        //                         toastr.success("Media Deleted Successfully");
        //                     }
        //                 }
        //             }else {
        //                 toastr.error("Something went wrong!");
        //                 console.log("incoming_message --> does not match any action incident_class socket.",response);
        //             }
        //             // $scope.messages = Query.sort($scope.messages,'createdAt',true);
        //             $scope.$apply();
        //         });
        //     });
        // };

        var setSocketForMessages = function(){
            $timeout(function () {
                if($scope.selected != 0){
                    $scope.valid = false;
                    console.log('listening----incoming_message:'+$scope.selected)
                    SOCKET.on('incoming_message:'+$scope.selected, function (response) {
                        var data = response.data;
                        if(response.action == "new"){
                            console.log("incoming_message new------",data);
                            $scope.messages.push(data);
                            $scope.managearray($scope.selected,true);
                            toastr.success("New message added successfully");
                        }else if(response.action == "update"){
                            console.log("incoming_message update",data);
                            // var messageToShow = Query.filter($scope.messages , {articleId : data.articleId},false)
                            for(var i = 0; i < $scope.messages.length; i++){
                                if($scope.messages[i].id == data.id){

                                    $scope.messages[i] = data;
                                    $scope.managearray($scope.selected,true);

                                    toastr.success("message updated successfully");
                                    break;
                                }
                            }
                        }else if(response.action == "delete"){
                            console.log("incoming_message delete",data);
                            // var messageToShow = Query.filter($scope.messages , {articleId : data.articleId},false)
                            for(var i = 0; i < $scope.messages.length; i++){
                                if($scope.messages[i].id == data.id){
                                    $scope.messages.splice(i,1);
                                    $scope.managearray($scope.selected,true);
                                    toastr.success("message deleted successfully");
                                    break;
                                }
                            }
                        }else {
                            toastr.error("Something went wrong!");
                            console.log("incoming_message --> does not match any action incident_class socket.",response);
                        }
                        // $scope.messages = Query.sort($scope.messages,'createdAt',true);
                        $scope.$apply();
                    });
                }else{
                    $scope.valid = true;
                    console.log('listening----incoming_message:'+$scope.user.userAccountId)
                    SOCKET.on('incoming_message:'+$scope.user.userAccountId, function (response) {
                        var data = response.data;
                        if($scope.valid){
                            if(response.action == "new"){
                                console.log("incoming_message new------",data);
                                $scope.messageToShow.push(data);
                                toastr.success("New message added successfully");
                            }else if(response.action == "update"){
                                console.log("incoming_message update",data);
                                for(var i = 0; i < $scope.messages.length; i++){
                                    if($scope.messageToShow[i].id == data.id){
                                        $scope.messageToShow[i] = data;
                                        toastr.success("message updated successfully");
                                    }
                                }
                            }else if(response.action == "delete"){
                                console.log("incoming_message delete",data);
                                for(var i = 0; i < $scope.messages.length; i++){
                                    if($scope.messageToShow[i].id == data.id){
                                        $scope.messageToShow.splice(i,1);
                                        toastr.success("message deleted successfully");
                                    }
                                }
                            }else {
                                toastr.error("Something went wrong!");
                                console.log("incoming_message --> does not match any action incident_class socket.",response);
                            }
                            // $scope.messages = Query.sort($scope.messages,'createdAt',true);
                            $scope.$apply();
                        }
                    });
                }
            });
        };

        function init(){
            $scope.referencesTable = function (tableState) {
                // $scope.selectoptions = []; 
                // $scope.selectoptions.push({id: 0,title: 'All'});
                // $scope.libraryToShow = []
                // $scope.isLoading = true;
                // $scope.tableState = tableState;

                // $http.post('/article-libraries/all?id=' + $routeParams.gamePlanId).then(function(response) {
                //     $http.get('/articles/all').then(function (resp) {
                //         $scope.gameTemplates = resp.data;
                //         angular.forEach($scope.gameTemplates, function(value) {
                //           $scope.selectoptions.push(value);
                //         });
                //         $scope.messages = response.data;
                //         $scope.isLoading = false;
                //         $scope.messages =  angular.copy($scope.messages);
                //         if($routeParams.gamePlanId){
                //             $scope.gameIdFound = true;
                //             $scope.selected = $routeParams.gamePlanId;
                //         }
                //         $scope.messageToShow =  angular.copy($scope.messages);
                //         // $scope.managearray($scope.selected);
                //     });
                // });

                $scope.selectoptions.push({id: 0,title: 'All'});
                $scope.isLoading = true;
                $scope.tableState = tableState;
                var params = 'id=';
                $scope.user = Query.getCookie('user');
                $http.get('/articles/all?userAccountId' + +$scope.user.userAccountId).then(function (resp) {
                    $scope.articles = resp.data;
                    if($routeParams.gamePlanId){
                        params += $routeParams.gamePlanId;
                    }else{
                        params += 'All Messages';
                    }
                    $http.post('/article-libraries/all?' + params).then(function (respp) {
                        $scope.selectoptions = $scope.selectoptions.concat($scope.articles);
                        $scope.messages = respp.data;
                        $scope.messages = _.sortBy($scope.messages, function (o) { return new Date(o.content); });
                        $scope.safeMessages = angular.copy($scope.messages);
                        $scope.isLoading = false;
                        if($routeParams.gamePlanId){
                            $scope.gameIdFound = true;
                            $scope.selected = $routeParams.gamePlanId;
                        }
                        $scope.messageToShow =  angular.copy($scope.messages);
                        $scope.managearray($scope.selected);
                    });
                });

            };
            // setSocketForMedia();
        }


        $scope.managearray = function(id,DontSet){
            if(id == 0){
                $scope.messageToShow =  angular.copy($scope.messages);
            }else{
                $scope.messageToShow = Query.filter($scope.messages , {parentId: $scope.selected},false);
            }
            $scope.messageToShow = $scope.paginate($scope.messageToShow);
            if(!DontSet){
                setSocketForMessages();
            }
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
                record: {},
                parentId: $scope.selected,
                contentType : 'article-library'
            };
            ModalService.showModal({
                templateUrl: "views/content-libraries/form.html",
                controller: "newMediaLibraryCtrl",
                inputs: inputs
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };


        $scope.callAtTimeout = function(record, index) {
            console.log('sadasda');
            ModalService.showModal({
                templateUrl: "views/content-libraries/form.html",
                controller: "newMediaLibraryCtrl",
                inputs:{
                    record: record,
                    parentId: record.parentId,
                    contentType: 'article-library'
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
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
