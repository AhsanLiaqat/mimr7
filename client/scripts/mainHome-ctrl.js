(function () {
    'use strict';

    angular.module('app')
    .controller('mainHomeCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$filter','Query','$sce', homeFunction]);

    function homeFunction($scope, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$filter,Query,$sce) {
        // formats date in some given format
        $scope.dateTimeFormat = function(dat){
            return moment(dat).utc().local().format('DD-MM-YYYY');
            //HH:mm
        };
        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };

        //fetch and set initial data
        function init() {
            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
            }
            $scope.user = Query.getCookie('user');
            $scope.employeeToShow = false;
            $scope.playerListToShow = false;
            $scope.organizationToShow = false;
            $scope.classToShow = false;
            $scope.studentToShow = false;
            $scope.mainContentToShow = false;
            $scope.contentShow = false;
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
            $scope.collectionToShow = false;
            $scope.scheduleToShow = false;
            $scope.activeToShow = false;
            $scope.completeToShow = false;
            $scope.chapter = {};
            $scope.messageRes = {};
            $scope.data = {};
            $scope.view = false;
            $scope.articleId = $routeParams.articleId;
            $http.get('/articles/all?userAccountId=' + $scope.user.userAccountId).then(function(response){
                $scope.article = response.data;
                $scope.currentArticle = $scope.article[0];
                $scope.message = $scope.currentArticle.messages;
                $scope.questions = $scope.message[0].questions;
                $scope.chapters = $scope.currentArticle.chapters;
                $scope.currentStatus = $scope.chapters[0]; 
            });
        }
        init();

        $scope.organizationTable = function (tableState) {
            $scope.isLoading = true;
            $http.get('/settings/organizations/all?userAccountId=' + $scope.user.userAccountId).then(function(res){
                $scope.organizations = res.data;
                $scope.organizations = _.sortBy($scope.organizations, function (o) { return o.name.toLowerCase(); });
                $scope.isLoading = false;
            });
        };

        $scope.playerListTable = function (tableState) {
            $scope.isLoading = true;
            $http.get('/settings/player-lists/all?userAccountId=' + $scope.user.userAccountId).then(function(res){
                $scope.player_lists = res.data;
                $scope.player_lists = _.sortBy($scope.player_lists, function (o) { return o.name.toLowerCase(); });
                $scope.isLoading = false;
            });
        };

        $scope.employeeListTable = function (tableState) {
            $scope.isLoading = true;
            $http.get('/settings/students/find-all?userAccountId=' + $scope.user.userAccountId).then(function(res){
                $scope.employees = res.data;
                $scope.employees = _.sortBy($scope.employees, function (o) { return o.firstName.toLowerCase(); });
                $scope.isLoading = false;
            });
        };

        $scope.collectionListTable = function (tableState) {
            $scope.isLoading = true;
            $http.get('/articles/all').then(function(res){
                $scope.article = res.data;
                $scope.article = _.sortBy($scope.article, function (o) { return o.title.toLowerCase(); });
                $scope.isLoading = false;
            });
        };


        $scope.showContents = function(){
            $scope.mainContentToShow = !$scope.mainContentToShow;
            $scope.contentToShow = false;
            $scope.classToShow = false;
            $scope.studentToShow = false;
            $scope.collectionToShow = true;
            $scope.scheduleToShow = false;
            $scope.activeToShow = false;
            $scope.completeToShow = false;
            $scope.organizationToShow = false;
            $scope.playerListToShow = false;
            $scope.employeeToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
        }

        $scope.changeArticle = function (record) {
            $scope.contentShow = false;
            $scope.selectedArticle = record;
            $http.get('/articles/get/' + $scope.selectedArticle.id).then(function(response){
                $scope.currentArticle = response.data;
                $scope.message = $scope.currentArticle.messages;
                $scope.chapters = $scope.currentArticle.chapters;
                $scope.currentStatus = $scope.chapters[0]; 
            });
        };
        $scope.toggleMenu = (question,event) => {
            event.stopPropagation();
            event.preventDefault();
            question.show = !question.show;
        }

        $scope.toggleList = (messageRes) => {
            messageRes.show = !messageRes.show;
        }


        $scope.toggleMessageList = () => {
            $scope.messagesToShow = true;
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.collectionToShow = false;
            $scope.showHighlightsModal = false;
        }

        $scope.toggleOrganizationList = () => {
            $scope.organizationToShow = true;
            $scope.playerListToShow = false;
            $scope.employeeToShow = false;
        }

        $scope.togglePlayerList = () => {
            $scope.organizationToShow = false;
            $scope.playerListToShow = true;
            $scope.employeeToShow = false;
        }

        $scope.toggleEmployeList = () => {
            $scope.organizationToShow = false;
            $scope.playerListToShow = false;
            $scope.employeeToShow = true;
        }
        $scope.toggleCollectionList = () => {
            $scope.collectionToShow = true;
            // $scope.scheduleToShow = false;
            // $scope.activeToShow = false;
            // $scope.completeToShow = false;
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
        }
        $scope.toggleScheduleList = () => {
            $scope.collectionToShow = false;
            $scope.scheduleToShow = true;
            $scope.activeToShow = false;
            $scope.completeToShow = false;
            $http.get('/content-plan-templates/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
            $scope.scheduleContentToShow = [];
                $scope.scheduled_collections = response.data;
                angular.forEach($scope.scheduled_collections, function(value) {
                    if(value.content_activated == false){
                        $scope.scheduleContentToShow.push(value);
                    }
                });
            });
        }
        $scope.toggleActiveList = () => {
            $scope.collectionToShow = false;
            $scope.scheduleToShow = false;
            $scope.activeToShow = true;
            $scope.completeToShow = false;
            $http.get('/content-plan-templates/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
            $scope.activeContentToShow = [];
                $scope.active_collections = response.data;
                angular.forEach($scope.active_collections, function(value) {
                    if(value.content_activated == true && value.status != 'stop'){
                        $scope.activeContentToShow.push(value);
                    }
                });
            });
        }
        $scope.toggleCompleteList = () => {
            $scope.collectionToShow = false;
            $scope.scheduleToShow = false;
            $scope.activeToShow = false;
            $scope.completeToShow = true;
            $http.get('/content-plan-templates/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
            $scope.completeContentToShow = [];
                $scope.complete_collections = response.data;
                angular.forEach($scope.complete_collections, function(value) {
                    if(value.status == 'stop'){
                        $scope.completeContentToShow.push(value);
                    }
                });
            });
        }

        $scope.showStudents = function(){
            $scope.studentToShow = !$scope.studentToShow;
            $scope.organizationToShow = true;
            $scope.classToShow = false;
            $scope.mainContentToShow = false;
            $scope.playerListToShow = false;
            $scope.employeeToShow = false;
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
            $scope.collectionToShow = false;
            $scope.scheduleToShow = false;
            $scope.activeToShow = false;
            $scope.completeToShow = false;
        }

        $scope.close = () => {
            $(".add-query").removeClass("slide-div");
            $(".questions-wrapper").removeClass("questions-wrapper-bg");
            $scope.showHighlightsModal = false;
        } 

        $scope.closeHighlight = () => {
            $(".add-highlight-modal").removeClass("slide-div");
            $(".highlights-wrapper").removeClass("highlights-wrapper-bg");
        }
        $scope.addContent = () => {
            $scope.contentShow = true;
            $scope.chapter.text = '';
        }
        $scope.cancelContent = () => {
            $scope.contentShow = false;
        }
        $scope.editContent = (currentContent) => {
            $scope.contentShow = true;
            $scope.chapter = angular.copy(currentContent);
        }
        $scope.save = () => {
            if($scope.data.id){
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/messages/update',{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
                $scope.showHighlightsModal = false; 
            }else{
                if($scope.data.content){
                    $scope.data.articleId = $scope.currentArticle.id;
                    $http.post('/messages/save',{data : $scope.data})
                    .then(function(res){
                        $scope.data = res.data;
                        $scope.message.push(res.data);
                        toastr.success('Message Added.', 'Success!');
                        $(".add-query").removeClass("slide-div");
                        $(".questions-wrapper").removeClass("questions-wrapper-bg");
                        $scope.showHighlightsModal = false; 
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
        };

        $scope.saveHighlight = () => {
            if($scope.highlight_data.id){
                $scope.highlight_data.articleId = $scope.currentArticle.id;
                $http.post('/messages/update',{data : $scope.highlight_data})
                .then(function(res){
                    $(".add-highlight-modal").removeClass("slide-div");
                    $(".highlights-wrapper").removeClass("highlights-wrapper-bg");
                });
            }
                
        };

        $scope.updateMessage = () => {
            if($scope.message_data.id){
                $scope.message_data.messageId = $scope.msg.id;
                $scope.message_data.articleId = $scope.currentArticle.id;
                $http.post('/questions/update/' + $scope.message_data.id,{data : $scope.message_data})
                .then(function(res){
                    $(".add-highlight-modal").removeClass("slide-div");
                    $(".highlights-wrapper").removeClass("highlights-wrapper-bg");
                });
            }
                
        };


        $scope.toggleContentList = () => {
            $scope.contentToShow = true;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
            $scope.collectionToShow = false;
        }

        $scope.toggleHighlightList = () => {
            $scope.highlightsToShow = true;
            $scope.contentToShow = false;
            $scope.messagesToShow = false;
            $scope.collectionToShow = false;
            $scope.showHighlightsModal = false;
        }

        $scope.addOrganization = function () {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-organization-modal.html",
                controller: "addOrganizationModalCtrl",
                inputs: {
                    organizationId : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.organizations.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

         $scope.editOrganization = function (record,index) {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-organization-modal.html",
                controller: "addOrganizationModalCtrl",
                inputs: {
                    organizationId : record.id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.organizations[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.showClass = function(){
            $scope.classToShow = !$scope.classToShow;
            $scope.toggleScheduleList();
            $scope.studentToShow = false;
            $scope.mainContentToShow = false;
            $scope.collectionToShow = false;
            $scope.activeToShow = false;
            $scope.completeToShow = false;
            $scope.organizationToShow = false;
            $scope.playerListToShow = false;
            $scope.employeeToShow = false;
            $scope.contentToShow = false;
            $scope.highlightsToShow = false;
            $scope.messagesToShow = false;
            
        }

        $scope.addCollections = function () {
            ModalService.showModal({
                templateUrl: "views/content/new-content-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: null,
                    show_details : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.article.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.CreatePlayerList = () => {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/form.html",
                controller: "playerListModalCtrl",
                inputs: {
                    list: null,
                    organizationId : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.player_lists.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.importPlayers = function (listId,players) {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/importPlayerList.html",
                controller: "importPlayerListModalCtrl",
                inputs: {
                    listId: listId,
                    players_list : players
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.playerListTable($scope.tableState);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });  
        };


        $scope.addEmployee = function() {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-student-form.html",
                controller: "newStudentCtrl",
                inputs : {
                    studentId : null,
                    organizationId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.employees.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.saveMessage = () => {
            if($scope.data.id){
                $scope.data.messageId = $scope.msg.id;
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/questions/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
                $scope.showHighlightsModal = false;
            }else{
                if($scope.data.name && $scope.msg.id){
                    $scope.data.messageId = $scope.msg.id;
                    $scope.data.articleId = $scope.currentArticle.id;
                    $http.post('/questions/save',{data : $scope.data})
                    .then(function(res){
                        $scope.data = res.data;
                        $scope.questions.push(res.data);
                        toastr.success('Message Added.', 'Success!');
                        $(".add-query").removeClass("slide-div");
                        $(".questions-wrapper").removeClass("questions-wrapper-bg");
                        $scope.showHighlightsModal = false;
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
                
        };

        $scope.changeHighlight = (chkId) => {
            $scope.msg = Query.filter($scope.message, { id: chkId}, true);
            Query.setCookie('highlightSelected', $scope.msg.id);
            $http.get('/questions/all/' + $scope.msg.id).then(function(res){
                $scope.questions = res.data;
            });
        };

        $scope.changeMessage = (chkId) => {
            $scope.ques = Query.filter($scope.questions, { id: chkId}, true);
            Query.setCookie('messageSelected', $scope.ques.id);
            $http.get('/responses/get/' + $scope.ques.id).then(function(res){
                $scope.messageRes = res.data;
            });
        };

        $scope.saveContent = () => {
            if($scope.chapter && $scope.chapter.id){
                $http.post('/chapters/update/' + $scope.chapter.id,{data : $scope.chapter}).then(function(res){
                    $scope.currentStatus = res.data;
                    $scope.contentShow = false;
                    $scope.chapter.name = '';
                    $scope.chapter.text = '';
                });
            }else{
                $scope.chapter.articleId = $scope.currentArticle.id;
                $scope.chapter.name =  'chapter ' + ($scope.chapters.length + 1);
                if($scope.chapter.text){
                    $http.post('/chapters/save',{data : $scope.chapter}).then(function(res){
                        $scope.chapters.push(res.data);
                        $scope.currentStatus = res.data;
                        $scope.contentShow = false;
                        $scope.chapter.name = '';
                        $scope.chapter.text = '';
                    });
                }else{
                    toastr.error('Enter All Fields');
                }
            }
        }
        $scope.deleteContent = (id) => {
            $http.delete('/chapters/delete/' + id + '/' + $scope.currentArticle.id).then(function(res){
                $scope.chapters = res.data;
                $scope.currentStatus = $scope.chapters[0];
            });
        }

        $scope.saveResponse = () => {
            if($scope.data.id){
                $scope.data.questionId = $scope.ques.id;
                $scope.data.articleId = $scope.currentArticle.id;
                $http.post('/responses/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
                $scope.showHighlightsModal = false;
            }else{
                if(!$scope.messageRes){
                    if($scope.data.name && $scope.ques.id){
                        $scope.data.questionId = $scope.ques.id;
                        $scope.data.articleId = $scope.currentArticle.id;
                        $http.post('/responses/save',{data : $scope.data})
                        .then(function(res){
                            $scope.messageRes = res.data;
                            toastr.success('Response Added.', 'Success!');
                            $(".add-query").removeClass("slide-div");
                            $(".questions-wrapper").removeClass("questions-wrapper-bg");
                            $scope.showHighlightsModal = false;
                        });
                    }else{
                        toastr.error('Enter All Fields');
                    }
                }else{
                    toastr.error('Response is Already Exist');
                }
            }
                
        };

        $scope.changeStatus = (chap) => {
            $http.get('/chapters/get/' + chap.id).then(function(res){
                $scope.currentStatus = res.data;
            });
        };

        $scope.edit = (question) => {
            $(".add-query").addClass("slide-div");
            $(".questions-wrapper").addClass("questions-wrapper-bg");
            $scope.data = question;
            $scope.showHighlightsModal = true;
        };

        $scope.editPlayerList = function (list, index) {
            ModalService.showModal({
                templateUrl: "views/settings/player-lists/form.html",
                controller: "playerListModalCtrl",
                inputs: {
                    list: list,
                    organizationId : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if(result){
                        $scope.player_lists[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });  
        };


        $scope.editHighlight = (highlight) => {
            $(".add-highlight-modal").addClass("slide-div");
            $(".highlights-wrapper").addClass("highlights-wrapper-bg");
            $scope.view = false;
            $scope.highlight_data = highlight;
        };

        $scope.editMessage = (message) => {
            $(".add-highlight-modal").addClass("slide-div");
            $(".highlights-wrapper").addClass("highlights-wrapper-bg");
            $scope.view = false;
            $scope.message_data = message;
        };

        $scope.viewHighlight = (highlight) => {
            $(".add-highlight-modal").addClass("slide-div");
            $(".highlights-wrapper").addClass("highlights-wrapper-bg");
            $scope.view = true;
            $scope.highlight_data = highlight;
        };

        $scope.viewMessage = (message) => {
            $(".add-highlight-modal").addClass("slide-div");
            $(".highlights-wrapper").addClass("highlights-wrapper-bg");
            $scope.view = true;
            $scope.message_data = message;
        };

        $scope.editStudent = function(record,index) {
            ModalService.showModal({
                templateUrl: "views/settings/organizations/add-student-form.html",
                controller: "newStudentCtrl",
                inputs : {
                    studentId : record.id,
                    organizationId : null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.employees[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.message , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });

        $scope.delete = (messageId,index) => {
            $http.delete('/messages/remove/' + messageId)
            .then(function(res){
                $scope.data = res.data;
                $scope.message.splice(index,1);
                toastr.success('Question Deleted.', 'Success!');

            });
        };
        $scope.deleteResponse = (responseId,index) => {
            $http.delete('/responses/remove/' + responseId)
            .then(function(res){
                $scope.messageRes = '';
                toastr.success('Response Deleted.', 'Success!');
            });
        };

        $scope.deleteMessage = (questionId,index) => {
            $http.delete('/questions/delete/' + questionId)
            .then(function(res){
                $scope.questions.splice(index,1);
                toastr.success('Question Deleted.', 'Success!');
            });
        };

        $scope.deleteOrganization = function (id, index) {
            $http.delete('/settings/organizations/remove/' + id)
                .then(function(res){
                   $scope.organizations.splice(index, 1);
                });
        };

        $scope.deletePlayerList = function (listId, index) {
            $http.delete("/settings/player-lists/remove/" + listId)
            .then(function(res){
                $scope.playerListTable ($scope.tableState);
                toastr.success('Player List deleted.', 'Success!');
            });
        };

        $scope.deleteStudent = function (id, index) {
            $http.delete('/settings/students/remove/' + id)
                .then(function(res){
                   $scope.employees.splice(index, 1);
                });
        };

        $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.questions , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });


        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }

        $scope.managearray = function(){
            $scope.scheduleContentToShow = [];
            $scope.activeContentToShow = [];
            angular.forEach($scope.contents, function(value) {
                if(value.content_activated == false){
                    $scope.scheduleContentToShow.push(value);
                }else if(value.content_activated == true && value.status != 'stop'){
                    $scope.activeContentToShow.push(value);
                }
            });
        };

        $scope.addClass = () => {
            if($scope.scheduleToShow){
                $scope.autoScheduleContent();
            }
        };

        $scope.addStudent = () => {
            if($scope.organizationToShow){
                $scope.addOrganization();
            }else if($scope.playerListToShow){
                $scope.CreatePlayerList();
            }else{
                $scope.addEmployee();
            }
        };

        $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                $scope.messageRes.show = false;
            }
        });

        $scope.showCollectionDetail = function(id){
            ModalService.showModal({
                templateUrl: "views/content/new-content-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: id,
                    show_details : true
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.scheduleContent = function (collection) {
            ModalService.showModal({
                templateUrl: "views/schedule-content/content-library.html",
                controller: "contentLibraryCtrl",
                inputs: {
                    collection: collection,
                    decider : false
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.autoScheduleContent = function (collection) {
            ModalService.showModal({
                templateUrl: "views/schedule-content/content-library.html",
                controller: "contentLibraryCtrl",
                inputs: {
                    collection: collection,
                    decider : true
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $http.get('/content-plan-templates/all?userAccountId=' + $scope.user.userAccountId).then(function (response) {
                    $scope.scheduleContentToShow = [];
                        $scope.scheduled_collections = response.data;
                        angular.forEach($scope.scheduled_collections, function(value) {
                            if(value.content_activated == false){
                                $scope.scheduleContentToShow.push(value);
                            }
                        });
                    });
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editScheduleContent = function (contentId,index) {
            ModalService.showModal({
                templateUrl: "views/schedule-content/edit-content-library.html",
                controller: "editContentLibraryCtrl",
                inputs: {
                    gameId: contentId
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.scheduleContentToShow[index] = result.data;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.editModal = function (id, index) {
            ModalService.showModal({
                templateUrl: "views/content/new-content-making.html",
                controller: "addArticleModalCtrl",
                inputs: {
                    gameId: id,
                    show_details : null
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== '') {
                        $scope.article[index] = result;
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.deleteCollection = function (index, card) {
            $http.delete('/articles/remove/' + card.id)
            .then(function(res){
                $scope.article.splice(index,1);
                toastr.success('Content Template Deleted.', 'Success!');
            });
        };

        $scope.showClassStudents = function(students){
            ModalService.showModal({
                templateUrl: "views/schedule-content/show-students-modal.html",
                controller: "classStudentsCtrl",
                inputs: {
                    students : students
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        // $scope.deleteScheduleContent = function (card, index) {
        //     $http.delete('/content-plan-templates/remove/' + card.id)
        //     .then(function(res){
        //         $scope.gameToShow.splice(index,1);
        //         toastr.success('Content Template Deleted.', 'Success!');
        //     });
        // };

        $scope.deleteScheduleContent = function (card, index) { // tick
            ModalService.showModal({
                templateUrl: "views/content/delete-confirmation-popup.html",
                controller: "removeContentCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result != undefined && result.answer === '87654321'){
                        $http.delete('/content-plan-templates/remove/' + card.id)
                        .then(function(res){
                            $scope.scheduleContentToShow.splice(index,1);
                            toastr.success('Content Template Deleted.', 'Success!');
                        });
                    }else{
                        toastr.error('Content not deleted, Try again!');
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });

        }

        $scope.sendQuestions = function(content_template){
            $http.get('/content-plan-templates/get/'+content_template.id).then(function(response) {
                $scope.data = response.data;
                $http.post('/content-plan-templates/update/'+content_template.id, {content_activated: true,play_date: new Date(),start_time : new Date()})
                .then(function(response){
                    if(content_template.article.kind == 'message'){
                        angular.forEach($scope.data.question_schedulings, function(question) {
                            var dataMessage = {setOffTime : new Date()};
                            $http.post('/question-scheduling/update-message-off-set/'+question.id,{data:dataMessage});
                        });
                    }else{
                        angular.forEach($scope.data.scheduled_surveys, function(survey) {
                            var dataSurvey = {setOffTime : new Date()};
                            $http.post('/scheduled-surveys/update-message-off-set/'+survey.id,{data:dataSurvey});
                        });
                    }
                    $http.get('/content-plan-templates/all?userAccountId=' + $scope.user.userAccountId)
                    .then(function (response) {
                        $scope.contents = response.data;
                        $scope.managearray();
                    });
                });
            });
        }

    }
}());
