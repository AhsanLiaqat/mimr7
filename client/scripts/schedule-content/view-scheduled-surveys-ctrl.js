/*View-Scheduled-Question*/
/*In this controller we implement survey scheduling functionality we drag survey and drop onto the calendar*/
/*Naveed Iftikhar*/
(function () {
    'use strict';

    angular.module('app')
        .controller('viewScheduledSurveyCtrl', ['$timeout', '$scope', '$routeParams', '$http', 'AuthService', 'Query', 'filterFilter','ModalService','$sce','$uibModal', addFunction]);

    function addFunction($timeout, $scope, $routeParams, $http, AuthService, Query, filterFilter,ModalService,$sce,$uibModal,uiCalendarConfig) {

        let refreshEvents = () => {
            $scope.Ids = $scope.events.map(function (cl) {
                return cl.dynamic_form.id;
            });
        }
        $scope.init = () => {
            $scope.user = Query.getCookie('user');
            $http.get('/dynamic-form/all').then(function(response){
                $scope.dynamic_forms = response.data;
                angular.forEach($scope.dynamic_forms , function(form,index){
                    $timeout(function() {
                        $('#'+index).data('event', 
                        {
                                title: htmlToPlaintext(form.name), // use the element's text as the event title
                                className: "bg-color-red", // use the element's text as the event title
                                stick: true, // maintain when user navigates (see docs on the renderEvent method)
                                type : 'task',
                                defaultView: 'month',
                                // end : task.end,
                                data : form,
                                color : '#fff',
                                allDayDefault: true,
                                allDay : true,
                            });
                        $('#'+index).draggable({
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
                });
                $('#main-calendar').fullCalendar('refetchEvents');
                $('.fc-other-month').html('');
                $('.fc-prev-button').hide();
                $('.fc-next-button').hide();
                refreshEvents();
            });
            $http.get('/surveys/all?id=' + $routeParams.contentId).then(function(response){
                $scope.survey = response.data;
                angular.forEach($scope.survey , function(survy,index){
                    $scope.events.push({
                        id : survy.id,
                        dynamic_form : survy.dynamic_form,
                        title: htmlToPlaintext(survy.dynamic_form.name),
                        start: findActualDate(survy.offset)
                    })
                });
                refreshEvents();
            });
        };
        function htmlToPlaintext(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        }

        
        $scope.alertOnDrop = (event) => {
            console.log('what is id',event)
            let offset = findOffset(event.start._d);
            $http.post('/surveys/update/' + event.id,{data : {offset}}).then(function(res){
            });
        }

        $scope.alertOnEventClick = (event) => {
            ModalService.showModal({
                templateUrl: "views/schedule-content/repeat-survey.html",
                controller: "repeatSurveyCtrl",
                inputs: {
                    survey: event
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.uiConfig = {
            calendar:{
                timezone: 'UTC',
                editable: true,
                cache: false,
                header : {
                    left : 'month,agendaWeek',
                    right: 'prev,next',
                    center: ''
                },
                droppable: true,
                defaultDate: "2018-07-01",
                dayNamesShort : ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
                eventClick: $scope.alertOnEventClick, 
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventReceive: function(event) {
                    let dynamic_form = event.data;
                    let offset = findOffset(event.start._d);
                    $("#main-calendar").fullCalendar("removeEvents", function(evt) {
                        if (evt == event) return true;
                    });
                    var toData = {
                        articleId : $routeParams.contentId,
                        dynamicFormId : dynamic_form.id,
                        offset : offset,
                        type : false
                    }
                    $http.post('/surveys/save',{data : toData}).then(function(res){
                        $scope.events.push({
                            id : res.data.id,
                            dynamic_form : dynamic_form,
                            title: htmlToPlaintext(dynamic_form.name),
                            start: findActualDate(offset)
                        })
                        refreshEvents();
                    });
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
        
        let findOffset = (date) => {
            var utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
            return (utc - new Date(2018,6,1))/(1000*60*60);
        }

        let findActualDate = (offset) => {
            let offSet = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return new Date(2018,6,1+(Math.floor(offset/24)),(offset%24),0,0).toLocaleString("en-US", {timeZone: offSet});
            
        }

        //convert html to styled text
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        }
        // $(this).parent().css('position' , 'fixed')


    }
}());