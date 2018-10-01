angular.module('app').factory('ActionPlanService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var ActionPlanService = {
        get : function (routeId) {
            return Query.request('GET',$apiRootSettings+'action-plans/get?id=' + routeId,{});
        },
        lookUp : function (routeId) {
            return Query.request('GET',$apiRootSettings+'action-plans/lookup?userAccountId=' + routeId,{});
        },
        activities : function (id) {
            return Query.request('GET',$apiRootSettings+'action-plans/activities?actionPlanId=' + id,{});
        },
        incidentPlan : function (planId,incidentId) {
            return Query.request('GET',$apiRootSettings+'action-plans/incident-plan?actionPlanId=' + planId + '&incidentId=' + incidentId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/save',{data: data});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'action-plans/all',{});
        },
        assignActivity : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/assign-activity',{data: data});
        },
        assignActivitySection : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/assign-activity-section',{data: data});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'action-plans/delete/'+id,{});
        },
        deleteAssignedActivity : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/delete-assigned-activity',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/update',{data: data});
        },
        dashBoardSections : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/dash-board-sections',{data: data});
        },
        planWithAgendaPoint : function (id) {
            return Query.request('GET',$apiRootSettings+'action-plans/dash-board-activities/' + id,{});
        },
        planWithAgendaActivities : function(id) {
            return Query.request('GET',$apiRootSettings+'action-plans/dash-board-agenda-activities/' + id,{});
        },
        sections : function (id) {
            return Query.request('GET',$apiRootSettings+'action-plans/'+id+'/sections',{});
        },
        saveAgendaPointList : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/save-agenda-point-list',data);
        },
        copyActionPlan : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/copy-action-plan',data);
        },
        setAgendaPointList : function (data) {
            return Query.request('POST',$apiRootSettings+'action-plans/set-agenda-point-list',data);
        },
        getAgendaPoints : function (id) {
            return Query.request('GET',$apiRootSettings+'action-plans/get-agenda-points?id=' + id,{});
        },
        getAllCategoryAgendaPoints : function (id) {
            return Query.request('GET',$apiRootSettings+'action-plans/get-all-category-agenda-points?id=' + id,{});
        }
    };
    return ActionPlanService;
}]);