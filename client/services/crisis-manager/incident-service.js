angular.module('app').factory('IncidentService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var IncidentService = {
        get : function (paramsId) {
            return Query.request('GET',$apiRootCM+'api/incidents/get?id=' + paramsId,{});
        },
        list : function (userAccountId) {
            return Query.request('GET',$apiRootCM+'api/incidents/list?userAccountId=' + userAccountId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'api/incidents/update',{data: data});
        },
        unrestrictedList : function (userAccountId) {
            return Query.request('GET',$apiRootCM+'api/incidents/unrestricted-list?userAccountId=' + userAccountId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'api/incidents/save', data);
        },
        archiveList : function (userAccountId) {
            return Query.request('GET',$apiRootCM+'api/incidents/archive-list?userAccountId=' + userAccountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootCM+'api/incidents/delete/' + id,{});
        },
        all : function (userAccountId) {
            return Query.request('GET',$apiRootCM+'api/incidents/all?userAccountId=' + userAccountId,{});
        },
        updatePlan : function (data) {
            return Query.request('POST',$apiRootCM+'api/incidents/updatePlan',{data: data});
        },
    };
    return IncidentService;
}]);