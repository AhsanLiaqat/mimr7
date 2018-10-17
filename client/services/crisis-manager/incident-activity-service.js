angular.module('app').factory('IncidentActivityService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var IncidentActivityService = {
        get : function (id) {
            return Query.request('GET',$apiRootCM+'incident-activities/get?id=' + id,{});
        },
        getTask : function (incidentId) {
            return Query.request('GET',$apiRootCM+'incident-activities/get-task/' + incidentId,{});
        },
        create : function (data) {
            return Query.request('POST',$apiRootCM+'incident-activities/create',{data: data});
        },
        updateActor : function (activityId,data) {
            return Query.request('PUT',$apiRootCM+'incident-activities/update-actor/' + activityId,data);
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'incident-activities/update',data);
        },
        setInactive : function (data) {
            return Query.request('POST',$apiRootCM+'incident-activities/set-inactive',data);
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'incident-activities/delete/' + id,{});
        },
        setActive : function (data) {
            return Query.request('POST',$apiRootCM+'incident-activities/set-active',data);
        },
    };
    return IncidentActivityService;
}]);