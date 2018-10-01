angular.module('app').factory('EmailTrackService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var EmailTrackService = {
        all : function (id) {
            return Query.request('GET',$apiRootCM+'email-track/all?id=' + id,{});
        },
        allTeam : function (id) {
            return Query.request('GET',$apiRootCM+'email-track/all-team?id=' + id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'email-track/save',{data: data});
        },
        get : function (id) {
            return Query.request('GET',$apiRootCM+'email-track/get',{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'email-track/update',{data: data});
        },
    };
    return EmailTrackService;
}]);