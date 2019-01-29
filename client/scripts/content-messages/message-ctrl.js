(function () {
    'use strict';

    angular.module('app')
    .controller('messageCtrl', ['$scope', '$timeout', '$location', 'ModalService', '$filter', '$http', '$rootScope', '$route', 'AuthService','$routeParams','Query', taskFunc]);

    function taskFunc($scope, $timeout, $location, ModalService, $filter, $http, $rootScope, $route, AuthService,$routeParams,Query) {
        $scope.valid = false;
        $scope.items = [{name: '10 items per page', val: 10},
                        {name: '20 items per page', val: 20},
                        {name: '30 items per page', val: 30},
                        {name: 'show all items', val: 30000}]
        $scope.pageItems = 10;
        $scope.selected = 0;
        $scope.selectoptions = [];
        $scope.messageToShow = [];

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


        function init() {

            $scope.messagesTable = function (tableState) {
                
                $scope.selectoptions.push({id: 0,title: 'All'});
                $scope.isLoading = true;
                $scope.tableState = tableState;
                var params = 'id=';
                $scope.user = Query.getCookie('user');
                $http.get('/articles/all').then(function (resp) {
                    $scope.articles = resp.data;
                    if($routeParams.gamePlanId){
                        params += $routeParams.gamePlanId;
                    }else{
                        params += 'All Messages';
                    }
                    $http.get('/messages/all?' + params).then(function (respp) {
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
        }

        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        // do pagination
        $scope.paginate = function(arr){
            $scope.a = _.sortBy(arr, function (o) { return new Date(o.name); });
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

        //filter array to show on gamePlanId
        $scope.managearray = function(id,DontSet){
            if(id == 0){
                $scope.messageToShow =  angular.copy($scope.messages);
            }else{
                $scope.messageToShow = Query.filter($scope.messages , {articleId: $scope.selected},false);
            }
            $scope.messageToShow = $scope.paginate($scope.messageToShow);
            if(!DontSet){
                setSocketForMessages();
            }
        }


        // open details of message
        $scope.showMessageDetail = function(record) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/message-show-modal.html",
                controller: "messageShowDetailCtrl",
                inputs:{
                    message: record
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if (result && result !== ''){
                    }
                });
            });
        };

        // add message modal
        $scope.addModal = function() {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    messageId: null,
                    articleId: $routeParams.gamePlanId || $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addMedia = function(record) {
            var inputs = {
                record: {},
                parentId: record.id,
                contentType : 'message-library'
            };
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/form.html",
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

        $scope.addQuestions = function(record,index) {
            var inputs = {
                messageId : record.id,
                articleId : record.articleId
            };
            ModalService.showModal({
                templateUrl: "views/simulation/game-libraries/question.html",
                controller: "newQuestionCtrl",
                inputs: inputs
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.messageToShow[index].questions.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.edit = function(message, index) {
            ModalService.showModal({
                templateUrl: "views/simulation/game-messages/form.html",
                controller: "messageCreateCtrl",
                inputs:{
                    messageId: message.id,
                    articleId : $routeParams.gamePlanId || $scope.selected
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    // if(result){
                    //     $scope.messageToShow[index] = result;
                    // }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    // $scope.messagesTable($scope.tableState);
                });
            });
        };

        //deletes message
        $scope.deleteMessage = function (id, index) {
            $http.delete("/messages/remove/" + id)
                .then(function(res){
                   
                });
        };

        init();

    }


}());
