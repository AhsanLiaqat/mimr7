angular.module('app').factory('IncidentTeamService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var IncidentTeamService = {
        get : function (id) {
            return Query.request('GET',$apiRootSettings+'incident-teams/get?id=' + id,{});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'incident-teams/all',{});
        },
        typeAll : function () {
            return Query.request('GET',$apiRootSettings+'incident-teams/type-all?teamType=incident',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'incident-teams/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'incident-teams/save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'incident-teams/update/',{data: data});
        },
        list : function () {
            return Query.request('GET',$apiRootSettings+'incident-teams/list/',{});
        },
    };
    return IncidentTeamService;
}]);