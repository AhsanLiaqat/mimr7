angular.module('app').factory('IncidentShapeService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var IncidentShapeService = {
        all : function (incidentId) {
            return Query.request('GET',$apiRootCM+'incident-shapes/all?incidentId=' + incidentId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'incident-shapes/save',data);
        },
    };
    return IncidentShapeService;
}]);