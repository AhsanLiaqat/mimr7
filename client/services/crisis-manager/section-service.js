angular.module('app').factory('SectionService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var SectionService = {
        moveToDefaultSection : function (data) {
            return Query.request('POST',$apiRootCM+'reports/move-to-default-section',{data: data});
        },
        create1 : function (data) {
            return Query.request('POST',$apiRootCM+'sections/create1',data);
        },
        create : function (data) {
            return Query.request('POST',$apiRootCM+'sections/create',data);
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'sections/update',data);
        },
        updateForEdit : function (data) {
            return Query.request('POST',$apiRootCM+'sections/update-for-edit',data);
        },
        createDefault : function (data) {
            return Query.request('POST',$apiRootCM+'sections/create-default',data);
        },
        updateIndex : function (data) {
            return Query.request('POST',$apiRootCM+'sections/update-index',data);
        },
        delete : function (sectionId) {
            return Query.request('DELETE',$apiRootCM+'sections/delete/' + sectionId,{});
        },
    };
    return SectionService;
}]);