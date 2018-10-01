angular.module('app').factory('DashboardCategoryService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var DashboardCategoryService = {
        getAll : function (classId) {
            return Query.request('GET',$apiRootSettings+'dashboard-categories/all?id=' + classId,{});
        },
        getAllCategories : function () {
            return Query.request('GET',$apiRootSettings+'dashboard-categories/all-categories',{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'dashboard-categories/remove/'+id,{});
        },
        create : function (data) {
            return Query.request('POST',$apiRootSettings+'dashboard-categories/category-save/',{data: data});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'dashboard-categories/update/',{data: data});
        },
        setPosition : function (data) {
            return Query.request('POST',$apiRootSettings+'dashboard-categories/set-position',{data: data});
        }
    };
    return DashboardCategoryService;
}]);