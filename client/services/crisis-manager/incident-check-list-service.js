angular.module('app').factory('IncidentCheckListService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var IncidentCheckListService = {
        allCopies : function (id) {
            return Query.request('GET',$apiRootCM+'incident-check-list/all-copies?id=' + id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'incident-check-list/save',{data: data});
        },
        updateTask : function (data) {
            return Query.request('POST',$apiRootCM+'incident-check-list/update-task',{data: data});
        },
        delete : function (checkListId,incidentId) {
            return Query.request('DELETE',$apiRootCM+'incident-check-list/remove/' + checkListId + '/' + incidentId,{});
        },
    };
    return IncidentCheckListService;
}]);