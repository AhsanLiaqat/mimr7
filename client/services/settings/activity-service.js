angular.module('app').factory('ActivityService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var ActivityService = {
        all : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'activities/all?userAccountId=' + userAccountId,{});
        },
        notDecisions : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'activities/not-decisions?userAccountId=' + userAccountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'activities/remove?id=' + id,{});
        },
        create : function (data) {
            return Query.request('POST',$apiRootSettings+'activities/create/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'activities/update/',{data: data});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'activities/save/',{data: data});
        },
        incidentAgendaActivity : function (data) {
            return Query.request('POST',$apiRootSettings+'activities/save-incident-agenda-activity',data);
        },
    };
    return ActivityService;
}]);