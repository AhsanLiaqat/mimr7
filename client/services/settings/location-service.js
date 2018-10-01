angular.module('app').factory('LocationService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var LocationService = {
        get : function (id) {
            return Query.request('GET',$apiRootSettings+'locations/get?id=' + id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'locations/save', data);
        },
    };
    return LocationService;
}]);