angular.module('app').factory('IncidentPlanService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var IncidentPlanService = {
        get : function (planId,incidentId) {
            return Query.request('GET',$apiRootCM+'incident-plan/get?actionPlanId=' + planId + '&incidentId=' + incidentId,{});
        },
        userTasks : function (incidentId) {
            return Query.request('GET',$apiRootCM+'incident-plan/user-tasks?incidentId=' + incidentId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/update',data);
        },
        getActivities : function (incidentPlanId) {
            return Query.request('GET',$apiRootCM+'incident-plan/get-activities?id=' + incidentPlanId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/save', data);
        },
        saveAgendaActivities : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/save-agenda-activities', data);
        },
        saveIncidentAgendaPoint : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/save-agenda-point', data);
        },
        deleteIncidentAgendaPoint : function (id) {
            return Query.request('DELETE',$apiRootCM+'incident-plan/delete-agenda-point/'+id,{});
        },
        addOutcomes : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/add-outcomes',data);
        },
        checkCombinationPresence : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/check-combination-presence',data);
        },
        updateTIndex : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/update-t-index',data);
        },
        getSelectedOutcomes : function (actionId,incidentId) {
            return Query.request('GET',$apiRootCM+'incident-plan/get-selected-outcomes?actionPlanId=' + actionId + '&incidentId=' + incidentId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'incident-plan/delete/' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootCM+'incident-plan/all',{});
        },
        statusUpdate : function (data) {
            return Query.request('POST',$apiRootCM+'incident-plan/status-update',data);
        },
    };
    return IncidentPlanService;
}]);