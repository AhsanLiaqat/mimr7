angular.module('app').factory('AllCategoryService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var AllCategoryService = {
        list : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'all-categories/list?accountId=' + userAccountId,{});
        },
        listWithTask : function (userAccountId) {
            return Query.request('GET',$apiRootSettings+'all-categories/list-with-tasks?userAccountId=' + userAccountId,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'all-categories/delete/'+id,{});
        },
        create : function (data) {
            return Query.request('POST',$apiRootSettings+'all-categories/save/',{data: data});
        },
    };
    return AllCategoryService;
}]);