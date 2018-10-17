(function () {
    'use strict';

    angular.module('app')
        .controller('homeCtrl', ['$scope', '$http', 'ModalService', '$location', 'filterFilter','Query','CustomMessageService','IncidentService','$timeout', homeFunction]);

    function homeFunction($scope, $http, ModalService, $location, filterFilter,Query, CustomMessageService, IncidentService,$timeout) {

        function init() {

            $scope.incidents = [];
            $scope.timelineValues = {index: 0};
            $scope.incidentStatusOptions = [
                {name: 'Active Incidents', value: 'Active'},
                {name: 'On Hold Incidents', value: 'OnHold'},
                {name: 'Closed Incidents', value: 'Closed'},
            ]
            
            $scope.currentStatus = $scope.incidentStatusOptions[0];

            if (Query.getCookie('user')){
                $scope.user = Query.getCookie('user');
                setSocketForUnlinkPlan();
                IncidentService.unrestrictedList($scope.user.userAccountId).then(function(res){
                    $scope.incidents = res.data;
                    angular.forEach($scope.incidents, function (inc) {
                        updateIncidentFormData(inc);
                    });

                    var sortByCreated = _.sortBy($scope.incidents, function (o) { return new Date(o.createdAt); });
                    $scope.incidents = sortByCreated.reverse();
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });
                // $http.get("/api/incidents/unrestricted-list?userAccountId=" + $scope.user.userAccountId)
                // .then(function (res) {
                    
                // });
            }

            CustomMessageService.getactivationMessage('Action Plan','Email').then(function(response){
                $scope.customMessage = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.get('/settings/custom-messages/activation-message?type=Activate Team&template=Email')
            // .then(function (response) {
                
            // });
        }

        var setSocketForUnlinkPlan = function(){
            console.log("listening sockets....incident_plan_unlink:"+$scope.user.userAccountId);
            $timeout(function(){
                SOCKET.on('incident_plan_unlink:'+$scope.user.userAccountId, function (response) {
                    var data = response.data;
                    if(response.action == "delete"){
                        angular.forEach($scope.incidents, function(incident) {
                            console.log('',incident);
                            if (incident.id == response.data.incidentId){
                                angular.forEach(incident.incident_plans, function(plan,index) {
                                    if (plan.id == response.data.planId){
                                        incident.incident_plans.splice(index,1);
                                        toastr.success("Action Plan Unlinked Successfully!");
                                    }
                                });
                            }
                        });
                    }
                    else {
                        toastr.error("Something went wrong!");
                        console.log("incident_plan --> does not match any action incident_plan socket.",response);
                    }
                    $scope.$apply();
                });
            });
        }

        init();
        var updateIncidentFormData = function(inc){
            inc.form_entries = inc.form_data[inc.form_data.length -1];
            inc.count = 0;
            inc.skip = 0;
            if(inc.form_entries){
                var obj = JSON.parse(inc.form_entries.data);
                inc.nodata = false;
            }else{
                var obj = {};
                inc.nodata = true;
            }
            inc.keys = Object.keys(obj).length;
            Object.keys(obj).forEach(function(key) {
                if (obj[key] == 'yes') {
                    inc.count = inc.count + 1;
                }
                if(obj[key] == 'skip'){
                    inc.skip = inc.skip + 1;
                }
            });
            inc.to_show = '' + inc.count+ '/'+(inc.keys - inc.skip);
            inc.to_show_percentage = (inc.count/(inc.keys - inc.skip))*100;
        }

        $scope.changeIncidentStatus = function(status){
            $scope.currentStatus = status;
        };

        $scope.loadMap = function (incident) {
            if (incident) {
                ModalService.showModal({
                    templateUrl: "views/crisis-manager/general/location-map.html",
                    controller: "locationMapCtrl",
                    inputs: {
                        incident: incident
                    }
                }).then(function (modal) {
                    modal.element.modal({ backdrop: 'static', keyboard: false });
                    modal.close.then(function (result) {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');
                    });
                });
            } else {
                toastr.error('Please select an incident with location defined');
            }
        }

        $scope.dateFormat = function (dat) {
            return dat ? moment(dat).utc().local().format('HH:mm DD-MM-YYYY') : 'None';
        };

        $scope.checkNoIncident = function () {
            var filteredIncident = filterFilter($scope.incidents, {'active': $scope.currentStatus.value});
            return filteredIncident.length > 0 ? false : true;
        }

        $scope.closeIncidentModal = function(incident){
            console.log(incident);
            incident.active = 'Closed';
            IncidentService.update(incident).then(function(response){
                init();
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $http.post("/api/incidents/update", { data: incident })
            // .then(function (response) {
                
            // });
        }

        $scope.openEditModal = function (id) {
            ModalService.showModal({
                templateUrl: "views/incidents/editModal.html",
                controller: "incidentCtrl",
                inputs: {
                    IncidentId: id
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    init();
                });
            });
        };

        $scope.openTimeLine = function (incident) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/archive/archive-timeline.html",
                controller: "archiveTimelineCtrl",
                inputs: {
                    incident: incident
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.report = function (incident) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/archive/closed-report.html",
                controller: "archiveStatusReportCtrl",
                inputs: {
                    incident: incident
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };
        $scope.fillUpForm = function(incident) {
            $http.get("/dynamic-form/get?formType=Incident Questionnaire").then(function(response){
                if(response.data.length > 0){
                    $scope.questionnaire = response.data[0];
                    if($scope.questionnaire){
                        ModalService.showModal({
                            templateUrl: "views/dynamic-form/view.html",
                            controller: "dynamicFormViewCtrl",
                            inputs : {
                                sender: $scope.user,
                                record: 'user',
                                dynamicForm: $scope.questionnaire,
                                detailed : false,
                                tableInfo: {
                                    tableId: incident.id,
                                    tableName: AppConstant.INCIDENT_TABLE_NAME,
                                    dynamicFormId: $scope.questionnaire.id
                                }
                            }
                        }).then(function(modal) {
                            modal.element.modal( {backdrop: 'static',  keyboard: false });
                            modal.close.then(function(result) {
                                $('.modal-backdrop').remove();
                                $('body').removeClass('modal-open');
                                if(result){
                                    incident.form_data.push(result.data);
                                    updateIncidentFormData(incident);
                                }
                            });
                        });
                    }else{
                        toastr.warning("No Incident Form for your Account Found.");
                    }
                }else{
                    toastr.warning("No Incident Form for your Account Found.");
                }
            })
        };

        $scope.linkActionPlan = function (incident) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/home/show-action-plans.html",
                controller: "showActionPlanCtrl",
                inputs: {
                    incident: incident
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    if (result && result !== undefined && result !== '') {
                        incident.incident_plans.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.statusReport = function (incident) {
            ModalService.showModal({
                templateUrl: "views/crisis-manager/status-report/status-report.html",
                controller: "statusReportCtrl",
                inputs: {
                    incident: incident
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function () {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.addIncident = function () {
            ModalService.showModal({
                templateUrl: "views/home/add-incident-modal.html",
                controller: "addIncidentModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (response) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                    if(response && response !== ''){
                        $scope.incidents.unshift(response);
                    }
                });
            });
        };

        $scope.alertTeam = function () {
            ModalService.showModal({
                templateUrl: "views/home/alert-team-modal.html",
                controller: "alertTeamModalCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (response) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.showTeams = function () {

            ModalService.showModal({
                templateUrl: "views/crisis-manager/general/teams-template.html",
                controller: "showTeamsCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.checkPlanPresence = function(incident){
            return filterFilter(incident.incident_plans, { 'selected': true })[0];
        };

        $scope.openActionPlanActivities = function(plan,incidentId){
            ModalService.showModal({
                templateUrl: "views/crisis-manager/home/show-action-plan-activities.html",
                controller: "showActionPlanActivitiesCtrl",
                inputs:{
                    incidentPlan: plan,
                    incidentId: incidentId
                }
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (response) {
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        };

        $scope.getIncidentPlan = function(incident){
            var output = ''
            angular.forEach(incident.incident_plans, function (object) {
                if(object.action_plan){
                    output += object.action_plan.name + ',' ;
                }
            });
            return output.slice(0, -1);
        };

        $scope.removeIncident = function (incidentId) { // tick
            ModalService.showModal({
                templateUrl: "views/incidents/delete-incident-popup.html",
                controller: "removeIncidentCtrl"
            }).then(function (modal) {
                modal.element.modal({ backdrop: 'static', keyboard: false });
                modal.close.then(function (result) {
                    console.log(result);
                    if(result != undefined && result.answer === '87654321'){
                        IncidentService.delete(incidentId).then(function(res){
                            for (let i = 0; i < $scope.incidents.length; i++) {
                                if($scope.incidents[i].id == incidentId){
                                    $scope.incidents.splice(i,1);
                                    toastr.success("Incedent deleted");
                                }
                            }
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                        // $http.post('/api/incidents/delete', { id:  incidentId }).then(function (res) {
                            
                        // });
                    }else{
                        toastr.error('Incident not deleted, Try again!');
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });

        }
    }
}());
