angular.module('app').factory('OrganizationService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var OrganizationService = {
        get : function (routeId) {
            return Query.request('GET',$apiRootSettings+'organizations/get/' + routeId,{});
        },
        all : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'organizations/all?userAccountId=' + userAccountId,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'organizations/save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'organizations/update',{data: data});
        },
        remove : function (id) {
            return Query.request('DELETE',$apiRootSettings+'organizations/remove/' + id,{});
        },
    };
    return OrganizationService;
}]);