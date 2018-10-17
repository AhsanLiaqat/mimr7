angular.module('app').factory('TagService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var TagService = {
        all : function (id) {
            return Query.request('GET',$apiRootSettings+'tags/all?id=' + id,{});
        },
        bulkSave : function (data) {
            return Query.request('POST',$apiRootSettings+'tags/bulk-save',{data: data});
        },
        getAccountTags : function (accountId) {
            return Query.request('GET',$apiRootSettings+'tags/get-account-tags?userAccountId=' + accountId,{});
        },
    };
    return TagService;
}]);