(function () {
    'use strict';

    angular.module('app')
    .controller('incidentAgendaPointCreateCtrl', ['$scope', 'close', '$location', '$routeParams', 'ModalService', '$http', 'AuthService', 'Query','AllCategoryService','RoleService','IncidentPlanService','incident_plan_id','categoryId', 'agenda_point','activityType','AgendaPointService','action_plan_id','ActionPlanService', ctrlFunction]);

    function ctrlFunction($scope, close, $location, $routeParams, ModalService, $http, AuthService,Query, AllCategoryService, RoleService, IncidentPlanService, incident_plan_id, categoryId, agendapoint,activityType,AgendaPointService,action_plan_id,ActionPlanService) {

        $scope.categories = [];
        $scope.categoryId = categoryId;
        function init() {
            $scope.user = Query.getCookie('user');
            RoleService.all().then(function(response){
                $scope.roles = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            AllCategoryService.list($scope.user.userAccountId).then(function(response){
                $scope.categories = response.data;
            },function(err){
                if(err)
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                    toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
            });
            // $scope.agendapoint = agendapoint;
            if(agendapoint !== null) {
                $scope.agendapoint = agendapoint;
                $scope.heading = 'Edit Agenda Point';
            }else{
                $scope.agendapoint = {};
                $scope.heading = 'Create New Agenda Point';
            }
            if(incident_plan_id){
                $scope.agendapoint.incident_plan_id = incident_plan_id;
            }
            if(categoryId){
                $scope.agendapoint.allCategoryId = categoryId;
            }
        }

        $scope.submit = function() {
            if(activityType == 'incident-agenda'){
                if($scope.agendapoint.id == undefined){
                    IncidentPlanService.saveIncidentAgendaPoint($scope.agendapoint).then(function(response){
                        toastr.success("agendapoint created successfully!");
                        close(response.data);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                }else{
                    IncidentPlanService.update($scope.agendapoint).then(function(response){
                        toastr.success("agendapoint updated successfully!");
                        close(response.data);
                    },function(err){
                        if(err)
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                        else
                            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                    });
                }
            }else{
                AgendaPointService.save($scope.agendapoint).then(function(response){
                    if(action_plan_id){
                        ActionPlanService.saveAgendaPointList({data: action_plan_id,selected: [response.data.id]}).then(function(resp){
                            toastr.success("Agendapoint linked successfully!");
                            close(response.data);
                        },function(err){
                            if(err)
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                            else
                                toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                        });
                    }
                },function(err){
                    if(err)
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                });


            }
        };

        $scope.createCategoryModal = function() {
            ModalService.showModal({
                templateUrl: "views/settings/all-categories/form.html",
                controller: "categoryCreateCtrl",
                inputs : {
                    category: null
                }
            }).then(function(modal) {
                modal.element.modal( {backdrop: 'static',  keyboard: false });
                modal.close.then(function(result) {
                    if(result){
                        $scope.categories.push(result);
                    }
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open');
                });
            });
        }

        $scope.validate = function(){
            if(($scope.agendapoint.name == undefined || $scope.agendapoint.name === "") ){
                return false;
            }else{
                if( $scope.agendapoint.tasks === "" || $scope.agendapoint.tasks == undefined){
                    return false;
                }else{
                    return true;
                }
            }
        }
        $scope.close = function() {
            close();
        }
        init();
    }
}());
