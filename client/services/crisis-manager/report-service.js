angular.module('app').factory('ReportService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var ReportService = {
        get : function (reportId) {
            return Query.request('GET',$apiRootCM+'reports/get?id=' + reportId,{});
        },
        all : function () {
            return Query.request('GET',$apiRootCM+'reports/all',{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'reports/save',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'reports/update',{data: data});
        },
        incidentReport : function (data) {
            return Query.request('POST',$apiRootCM+'reports/incident-report',{data: data});
        },
    };
    return ReportService;
}]);