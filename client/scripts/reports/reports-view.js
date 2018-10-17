(function () {
    'use strict';

    angular.module('app')
        .controller('reportsViewCtrl', ['$scope', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','ClassService','MessageHistoryService','ReportService','IncidentService', viewFunction]);

        function viewFunction($scope, $routeParams, $http, AuthService, ModalService, $location, ClassService,MessageHistoryService, ReportService, IncidentService) {

            function init() {
               if($routeParams.incidentId !== undefined) {
                   var incidentId = $routeParams.incidentId;
                   var path = '/api/incidents/get?id=' + incidentId;

                   AuthService.user().then(function(response) {
                       var user = response;
                       IncidentService.get(incidentId).then(function(response){
                            $scope.incident = response.data;
                            loadClasses();
                            loadMessageHistory();
                            var name = user.firstName + ' ' + user.middleName + ' ' + user.lastName;
                            $scope.status_report = '<h3>Information Manager: '  + name + '</h3>' + '<h3>Incident Name: ' + $scope.incident.name + '</h3>';
                       },function(err){
                        if(err)
                          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                       });
                       // $http.get(path).then(function(response) {
                            
                       // });
                   });
               }

               $scope.tinymceOptions = {
                 theme: "modern",
                 plugins: [
                   "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                   "searchreplace wordcount visualblocks visualchars code fullscreen",
                   "insertdatetime media nonbreaking save table contextmenu directionality",
                   "emoticons template paste textcolor"
                 ],
                 toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                 toolbar2: "print preview media | forecolor backcolor emoticons",
                 image_advtab: true,
                 statusbar: false
               };
           }

            function loadClasses() {
                ClassService.all($scope.incident.id).then(function(response){
                    $scope.classes = response.data;
                    $scope.subClasses = [];
                    var path;
                    if($scope.classes !== undefined) {
                        for(var i=0; i<$scope.classes.classes.length; i++) {
                            var s = 0;
                            ClassService.subClassAll($scope.classes.classes[i].id).then(function(response){
                                s++;
                                if(response.data.length > 0) {
                                    for(var j=0; j<response.data.length; j++) {
                                        $scope.subClasses.push(response.data[j]);
                                    }
                                }

                                 if(s === $scope.classes.classes.length) {
                                     bindMessages();
                                 }
                            },function(err){
                                if(err)
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                                else
                                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                            });
                            // path = '/class/sub-class/all?classId=' +  $scope.classes.classes[i].id;
                            // $http.get(path).then(function(response) {
                                
                            // });
                        }
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // var path = '/class/all?incidentId=' +  $scope.incident.id;
                // $http.get(path).then(function(response) {
                    
                // });
            }

            function loadMessageHistory() {
                if($scope.incident !== undefined) {
                    MessageHistoryService.all($scope.incident.id).then(function(response){
                        $scope.msgHistory = response.data;
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                    // var query2 = '/message-history/all/' + $scope.incident.id;
                    // $http.get(query2).then(function(response) {
                        
                    // });
                }
            }

            function bindMessages() {
                $scope.stats_report = '';
                var category, sub, messages, history = '';

                for(var i=0; i<$scope.classes.classes.length; i++) {
                    $scope.status_report = $scope.status_report + '<h2>' + $scope.classes.classes[i].title +'</h2> <p>' + $scope.classes.classes[i].summary + '</p>';
                    //for messages which are in none of the sub-category
                    messages = '';
                    for(var s=0; s<$scope.msgHistory.length; s++) {
                        if($scope.msgHistory[s].classId === $scope.classes.classes[i].id && $scope.msgHistory[s].subClassId === null) {

                                    messages =  messages + '<p>' + $scope.msgHistory[s].content +'</p>';
                        }
                    }
                    $scope.status_report = $scope.status_report + messages;
                    //for messages which are in some category
                    for(var j=0; j<$scope.subClasses.length; j++) {
                        if($scope.subClasses[j].classId === $scope.classes.classes[i].id) {
                            sub = '<h4>' + $scope.subClasses[j].title +'</h4>';
                            messages = '';
                            for(var k=0; k<$scope.msgHistory.length; k++) {               if($scope.msgHistory[k].subClassId !== undefined) {

                                    if($scope.msgHistory[k].subClassId === $scope.subClasses[j].id) {
                                        messages =  messages + '<p>' + $scope.msgHistory[k].content +'</p>';
                                    }
                                }
                                else if($scope.msgHistory[k].classId === $scope.classes.classes[i].id){
                                    messages =  messages + '<p>' + $scope.msgHistory[k].content +'</p>';
                                }
                          }
                           history = sub + messages;
                                $scope.status_report = $scope.status_report + history;
                                sub, messages, history = '';
                      }
                      else {

                      }
                   }
                }
            }

            $scope.save = function(content) {
                var data = {};
                data.content = content;
                data.date = moment().utc().format();
                data.incidentName =  $scope.incident.name;
                data.incidentId =  $scope.incident.id;
                ReportService.save(data).then(function(response){
                    toastr.success("Report saved successfully.");
                    $location.path('/reports');
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.post('/reports/save', {data: data}).then(function(response) {
                    
                // });
            }

            init();
        }

}());
