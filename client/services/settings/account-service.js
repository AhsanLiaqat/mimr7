angular.module('app').factory('AccountService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var AccountService = {
        get : function (routeId) {
            return Query.request('GET',$apiRootSettings+'accounts/get?id=' + routeId,{});
        },
        getAdmin : function (routeId) {
            return Query.request('GET',$apiRootSettings+'accounts/get-admin?id=' + routeId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/update',{data: data});
        },
        checkName : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/check-name',{data: data});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/save',{data: data});
        },
        all : function () {
            return Query.request('GET',$apiRootSettings+'accounts/all',{});
        },
        copyMessages : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-messages',{data: data});
        },
        copyTasks : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-tasks',{data: data});
        },
        copyDynamicForms : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-dynamic-forms',{data: data});
        },
        copyColors : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-colors',{data: data});
        },
        copyDepartments : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-departments',{data: data});
        },
        copyRoles : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-roles',{data: data});
        },
        copyIncidentTypes : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-incident-types',{data: data});
        },
        copyCategories : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-categories',{data: data});
        },
        getCounts : function (id) {
            return Query.request('GET',$apiRootSettings+'accounts/get-counts?userAccountId=' + id,{});
        },
        copySimulationGames : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-simulation-games',{data: data});
        },
        copyInformationGames : function (data) {
            return Query.request('POST',$apiRootSettings+'accounts/copy-information-games',{data: data});
        },
        allOrganization : function () {
            return Query.request('GET',$apiRootSettings+'accounts/all-organizations',{});
        },
    };
    return AccountService;
}]);