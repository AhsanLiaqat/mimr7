/*View-Scheduled-Question*/
/*In this controller we implement question scheduling functionality we drag question from question
section and drop onto the calendar*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('viewScheduledQuestionCtrl', ['$timeout', '$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($timeout, $scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal,uiCalendarConfig) {

        let refreshEvents = () => {
            $scope.Ids = $scope.events.map(function (cl) {
                return cl.id;
            });
        }
        $scope.init = () => {
            $scope.user = Query.getCookie('user');
            $http.get('messages/all?id=' + $routeParams.contentId).then(function(response){
                $scope.messages = response.data;
                angular.forEach($scope.messages , function(msg,index){
                    angular.forEach(msg.questions , function(question,qIndex){
                        if(question.offset){
                            // $scope.events.push({
                            //     id: question.id, 
                            //     title: htmlToPlaintext(question.name),
                            //     start: findActualDate(question.offset)
                            // })
                            $scope.events.push({
                                ...question,
                                title: htmlToPlaintext(question.name),
                                start: findActualDate(question.offset)
                            })
                        }else{
                            $timeout(function() {
                                $('#'+index+'_'+qIndex).data('event', 
                                {
                                        title: htmlToPlaintext(question.name), // use the element's text as the event title
                                        className: "bg-color-red", // use the element's text as the event title
                                        stick: true, // maintain when user navigates (see docs on the renderEvent method)
                                        type : 'task',
                                        defaultView: 'month',
                                        // end : task.end,
                                        data : question,
                                        color : '#fff',
                                        allDayDefault: true,
                                        allDay : true,
                                    });
                                $('#'+index+'_'+qIndex).draggable({
                                        zIndex: 99,
                                        revert: true,      // will cause the event to go back to its
                                        revertDuration: 0,  //  original position after the drag
                                        drag: function() {
                                            $(this).parent().css('overflow' , 'inherit');
                                        },
                                        stop: function() {
                                            $(this).parent().css('overflow' , 'auto');
                                        }
                                    });
                            }, 1);
                        }
                    });
                });
                $('#main-calendar').fullCalendar('refetchEvents');
                $('.fc-other-month').html('');
                $('.fc-prev-button').hide();
                $('.fc-next-button').hide();
                refreshEvents();
            });
        };
        function htmlToPlaintext(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }

        
        $scope.alertOnDrop = (event) => {
            // var days = event.start._d.getDate() - new Date(2018,6,1).getDate();
            // var offset = (days * 24) + new Date(event.start._d).getHours()
            let offset = findOffset(event.start._d);
            $http.post('/questions/update/' + event.id,{data : {offset}}).then(function(res){
            });
        }
        $scope.uiConfig = {
            calendar:{
                // height: 450,
                timezone: 'UTC',
                editable: true,
                cache: false,
                header : {
                    left : 'month,agendaWeek',
                    right: 'prev,next',
                    center: ''
                },
                // businessHours: {
                //   dow: [0, 1, 2, 3, 4, 5, 6, 7],
                //   start: '5:00',
                //   end: '23:00',
                // },
                droppable: true,
                defaultDate: "2018-07-01",
                dayNamesShort : ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
                eventClick: $scope.alertOnEventClick, 
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventReceive: function(event) {
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
                    
                    // let msgIndex = $scope.messages.findIndex(msg =>  msg.id == jsEvent.data.messageId);
                    // console.log('msg index is what a index',msgIndex)
                    // let questionIndex = $scope.messages[msgIndex].questions.findIndex(q =>  q.id == jsEvent.data.id);
                    // console.log(questionIndex, " Q INDEX");
                    // $scope.messages[msgIndex].questions.splice(questionIndex,1);
                },
                viewRender: function(view, element) {
                    if(view.intervalEnd._d > new Date(2018,6,31,0,0,0) && view.type == 'agendaWeek'){
                        $('.fc-next-button').addClass('fc-state-disabled');
                    }else{
                        $('.fc-next-button').removeClass('fc-state-disabled');
                    }
                    if(view.intervalEnd._d < new Date(2018,6,9,0,0,0) && view.type == 'agendaWeek'){
                        $('.fc-prev-button').addClass('fc-state-disabled');
                    }else{
                        $('.fc-prev-button').removeClass('fc-state-disabled');
                    }
                },
            }
        };
        $(document).on('click','.fc-agendaWeek-button', function () {
           $('.fc-prev-button').show();
           $('.fc-next-button').show();
        });

        $(document).on('click','.fc-month-button', function () {
           $('.fc-prev-button').hide();
           $('.fc-next-button').hide();
        });

        var date = new Date(2018,6,1);
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $scope.events = [];
        $scope.eventSources = [$scope.events];

        $scope.init();
        $scope.toggleMenu = (question) => {
            question.show = !question.show;
        }
        let findOffset = (date) => {
            var utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
            return (utc - new Date(2018,6,1))/(1000*60*60);
        }

        let findActualDate = (offset) => {
            let offSet = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return new Date(2018,6,1+(Math.floor(offset/24)),(offset%24),0,0).toLocaleString("en-US", {timeZone: offSet});
            
        }

        $scope.save = function () {
            if($scope.data.id){
                $scope.data.messageId = $scope.message.id;
                $scope.data.articleId = $scope.message.articleId;
                $http.post('/questions/update/' + $scope.data.id,{data : $scope.data})
                .then(function(res){
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }else{
                $scope.data.messageId = $scope.message.id;
                $scope.data.articleId = $scope.message.articleId;
                $http.post('/questions/save',{data : $scope.data})
                .then(function(res){
                    $scope.data = res.data;
                    $scope.questions.push(res.data);
                    toastr.success('Question Added.', 'Success!');
                    $(".add-query").removeClass("slide-div");
                    $(".questions-wrapper").removeClass("questions-wrapper-bg");
                });
            }
                
        };

        $scope.edit = function(question){
            $(".add-query").addClass("slide-div");
            $(".questions-wrapper").addClass("questions-wrapper-bg");
            $scope.data = question;
        };

         $('.main-wrapper').click(function(event){
            if(!($(event.target).hasClass('question-manage') || $(event.target).parents('.question-manage').length > 0)){
                angular.forEach( $scope.questions , function(value){
                    value.show = false;
                })
                $scope.$apply();
            }
        });

        $scope.delete = function(questionId,index){
            $http.delete('/questions/delete/' + questionId)
            .then(function(res){
                $scope.data = res.data;
                $scope.questions.splice(index,1);
                toastr.success('Question Deleted.', 'Success!');

            });
        };

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }
        // $(this).parent().css('position' , 'fixed')


    }
}());