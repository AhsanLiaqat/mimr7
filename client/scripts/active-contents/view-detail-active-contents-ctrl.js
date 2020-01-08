(function () {
    'use strict';

    angular.module('app')
        .controller('viewDetailActiveContentCtrl', ['$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location', 'filterFilter','$timeout','$rootScope','Query','$sce', playGameCtrl]);

    function playGameCtrl($scope, $filter, $routeParams, $http, AuthService, ModalService, $location, filterFilter,$timeout,$rootScope,Query,$sce) {
        // $scope.dateFormat = function (dat) {
        //     return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
        // };
        // $scope.setOffTimeFormat = function (dat) {
        //     return moment(dat).utc().local().format('mm:ss');
        // };

        // var setSocketForContentMessages = function () {
        //     $timeout(function () {
        //         console.log('Listening ----> detail_content:'+$routeParams.gameId);
        //         SOCKET.on('detail_content:'+$routeParams.gameId, function (response) {
        //             console.log('Message Recieved ----> detail_content:'+$routeParams.gameId,response.data);
        //             var reslt = response.data;
        //             if(reslt){
        //                 switch (response.action) {
        //                     case 'update':
        //                         // angular.forEach($scope.questionSchedule, function (question,ind){
        //                         //     // let questionArr = question.data.filter((q) => {
        //                         //     //     return q.id == data.id;
        //                         //     // });
        //                         //     // console.log(questionArr,"questionArr")
        //                         //     // if(!questionArr.length){
        //                         //     //     question.data.push(data);
        //                         //     // }
        //                         // var found = false;
        //                         // for (var i = 0; i < $scope.questionSchedule.length; i++) {
        //                         //     for (var j = 0; j < $scope.questionSchedule[i].data.length; j++) {
        //                         //         if ($scope.questionSchedule[i].data[j].id === reslt.id) {
        //                         //             $scope.questionSchedule[i].data[j] = angular.copy(reslt);
        //                         //             found = true;
        //                         //             break;
        //                         //         }
        //                         //     }
        //                         //     if(found)break;
        //                         // }
        //                         var found = false;
        //                         for(var i = 0; i < $scope.playContent.question_schedulings.length; i++){
        //                             if($scope.playContent.question_schedulings[i].id === reslt.id){
        //                                 $scope.playContent.question_schedulings[i] = angular.copy(reslt);
        //                                 found = true;
        //                                 break;
        //                             }
        //                             if(found)break;
        //                         }
        //                         break;
        //                     case 'skip':
        //                         // for(var i = 0; i < $scope.questionSchedule.length; i++){
        //                         //     for(var j = 0; j < $scope.questionSchedule[i].data.length; j++){
        //                         //         if($scope.questionSchedule[i].data[j].id === reslt.id){
        //                         //             $scope.questionSchedule[i].data[j] = angular.copy(reslt);
        //                         //             found = true;
        //                         //             break;
        //                         //         }
        //                         //     }
        //                         //     if(found)break;
        //                         // }
        //                         var found = false;
        //                         for(var i = 0; i < $scope.playContent.question_schedulings.length; i++){
        //                             if($scope.playContent.question_schedulings[i].id === reslt.id){
        //                                 $scope.playContent.question_schedulings[i] = angular.copy(reslt);
        //                                 found = true;
        //                                 break;
        //                             }
        //                             if(found)break;
        //                         }
        //                         toastr.success('Message Skipped', 'Success!');
        //                         break;
        //                 }
        //             }else{
        //                 console.log('Recieved Nothing on ---> detail_content:'+$routeParams.gameId);
        //             }
        //             $scope.$apply();
        //         });
        //     });
        // }

        // //fetch and set initial data
        // function init() {
        //     $scope.user = Query.getCookie('user');
        //     $scope.activeContentId = $routeParams.gameId;

        //     $http.get('/content-plan-templates/play-content-summary/' + $scope.gameId).then(function (response) {
        //         $scope.playContent = response.data;
        //         $scope.time = new Date($scope.playContent.start_time).getTime();
        //         // $scope.questionSchedule = [];
        //         // angular.forEach($scope.playContent.question_schedulings, function (scheduledQuestion,ind){
        //         //     if (scheduledQuestion.question){
        //         //         putData(scheduledQuestion.question.name,$scope.questionSchedule,scheduledQuestion,scheduledQuestion.question.id,scheduledQuestion.offset);
        //         //     }else{
        //         //         putData('N/A',$scope.questionSchedule,null,null,'N/A');
        //         //     }
        //         // });

        //     });
        //     setSocketForContentMessages();
        // };


        // var putData =  function(search,graph,inc,questionId,offset){
        //     var type = Query.filter(graph,{'name': search},true);
        //     if(type){
        //         type.data.push(inc);
        //     }else{
        //         graph.push({id:questionId,name: search,offset : offset,data: []});
        //         var type = Query.filter(graph,{'name': search},true);
        //         type.data.push(inc);
        //     }
        // }

        // init();

        // $scope.showMessageDetail = function(record) {
        //     ModalService.showModal({
        //         templateUrl: "views/content-messages/message-show-modal.html",
        //         controller: "messageShowDetailCtrl",
        //         inputs:{
        //             message: record,
        //             activeRecord : 'activeRecord',
        //             messageListing : null,
        //             questionDetail : null

        //         }
        //     }).then(function(modal) {
        //         modal.element.modal( {backdrop: 'static',  keyboard: false });
        //         modal.close.then(function(result) {
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //             if (result && result !== ''){
        //             }
        //         });
        //     });
        // };

        // $scope.showQuestionDetail = function(record) {
        //     ModalService.showModal({
        //         templateUrl: "views/content-messages/message-show-modal.html",
        //         controller: "messageShowDetailCtrl",
        //         inputs:{
        //             message: record,
        //             activeRecord : null,
        //             messageListing : null,
        //             questionDetail : 'questionDetail'
        //         }
        //     }).then(function(modal) {
        //         modal.element.modal( {backdrop: 'static',  keyboard: false });
        //         modal.close.then(function(result) {
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //             if (result && result !== ''){
        //             }
        //         });
        //     });
        // };

        // $scope.sendQuestion = function (contentQuestion) {
        //     $http.post('/question-scheduling/send-question/' + contentQuestion.id).then(function (response) {
        //     });
        // };

        // $scope.skipQuestion = function(contentQuestion){
        //     $http.post('/question-scheduling/update/' + contentQuestion.id,{data : {skip: true,skipped_At : new Date()}})
        //     .then(function (response) {
                
        //     });
        // }


        // $scope.cancelContent = function (card, index) { // tick
        //     ModalService.showModal({
        //         templateUrl: "views/content/delete-confirmation-popup.html",
        //         controller: "removeContentCtrl"
        //     }).then(function (modal) {
        //         modal.element.modal({ backdrop: 'static', keyboard: false });
        //         modal.close.then(function (result) {
        //             console.log(result);
        //             if(result != undefined && result.answer === '87654321'){
        //                 $http.post('/content-plan-templates/cancel-content/'+$scope.gameId, {status: 'stop'})
        //                 .then(function(response){
        //                     $location.path("/closed-contents");
        //                 });
        //             }else{
        //                 toastr.error('Content not deleted, Try again!');
        //             }
        //             $('.modal-backdrop').remove();
        //             $('body').removeClass('modal-open');
        //         });
        //     });
        // }

        // //close modal
        // $scope.close = function (params) {
        //     params = (params == null || params == undefined) ? '' : params; 
        //     // close(params);
        // };
        $scope.events = [];
        $scope.init = () => {
            $scope.user = Query.getCookie('user');
            $http.get('content-plan-templates/get/' + $routeParams.gameId).then(function(response){
                $scope.content_template = response.data;
                $http.get('messages/all?id=' + $scope.content_template.articleId).then(function(response){
                    $scope.highlights = response.data;
                    $scope.filtered_highlights = angular.copy($scope.highlights);
                });
            });
            $http.get('/content-plan-templates/play-content-summary/' + $routeParams.gameId).then(function (response) {
                $scope.playContent = response.data;
                angular.forEach($scope.playContent.question_schedulings , function(ques){
                    // $scope.events.push({
                    //     id: question.id, 
                    //     title: htmlToPlaintext(question.name),
                    //     start: findActualDate(question.offset)
                    // })
                    $scope.events.push({
                        ...ques,
                        title: htmlToPlaintext(ques.question.name),
                        start: findActualDate(ques.setOffTime)
                    });
                });
            });
            $('#main-calendar').fullCalendar('refetchEvents');
        };

        function htmlToPlaintext(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };

        $scope.search = function() {
            $scope.filtered_highlights = $filter('filter')($scope.highlights, $scope.searchKeywords);
        };

        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        };

        $scope.filteredMessages = function(highlight,event){
            event.stopPropagation();
            event.preventDefault();
            $scope.events.splice(0, $scope.events.length);
            $('#main-calendar').fullCalendar('refetchEvents');
            $http.get('/messages/get?id=' + highlight.id).then(function(response){
                $scope.filter_highlight_msg = response.data;
                angular.forEach($scope.filter_highlight_msg.questions , function(ques){
                    angular.forEach(ques.question_schedulings , function(sched_ques){
                        $scope.events.push({
                            ...sched_ques,
                            title: htmlToPlaintext(sched_ques.question.name),
                            start: findActualDate(sched_ques.setOffTime)
                        });

                    });
                });
            });
            $('#main-calendar').fullCalendar('refetchEvents');
        };

        $scope.uiConfig = {
            calendar:{
                // height: 450,
                timezone: 'UTC',
                editable: true,
                cache: false,
                header : {
                    left : 'month,agendaWeek',
                    right: 'prev,next',
                    center: 'title'
                },
                // businessHours: {
                //   dow: [0, 1, 2, 3, 4, 5, 6, 7],
                //   start: '5:00',
                //   end: '23:00',
                // },
                droppable: true,
                // lazyFetching : false,
                // refetchResourcesOnNavigate : true,
                // stick : true,
                fixedWeekCount : false,
                // defaultDate: "",
                // dayNamesShort : ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
                eventClick: $scope.alertOnEventClick, 
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventReceive: function(event) {
                    if(new Date(event.start._d) < new Date(2018,7,1)){
                        let question = event.data;
                        // let days = event.start._d.getDate() - new Date(2018,6,1).getDate();
                        // let offset = (days * 24) + new Date(event.start._d).getHours();
                        let offset = findOffset(event.start._d);
                        let newEventDay = event.start.startOf('day');
                        // let existingEvents = $("#main-calendar").fullCalendar("clientEvents", function(evt) {
                        //     return true;
                        // });
                        $("#main-calendar").fullCalendar("removeEvents", function(evt) {
                            if (evt == event) return true;
                        });
                        $http.post('/questions/update/' + question.id,{data : {offset}}).then(function(res){
                            $scope.events.push({
                                ...question,
                                title: htmlToPlaintext(question.name),
                                start: findActualDate(offset)
                            })
                            refreshEvents();
                        });
                    }else{
                        toastr.error('You Can Not Drop Message Here');
                        $('#main-calendar').fullCalendar('removeEvents', event._id);
                    }

                },
                viewRender: function(view, element) {
                    console.log($scope.eventSources);
                },
            }
        };
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        $scope.init();

        let findActualDate = (offset) => {
            let offSet = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return new Date(offset).toLocaleString("en-US", {timeZone: offSet});
        }

    }
}());
