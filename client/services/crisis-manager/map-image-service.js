angular.module('app').factory('MapImageService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var MapImageService = {
        mapImage : function (data) {
            return Query.request('POST',$apiRootCM+'api/map-images/map-image',{data: data});
        },
    };
    return MapImageService;
}]);