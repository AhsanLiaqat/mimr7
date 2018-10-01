angular.module('app').factory('ClassService', ['Query','$injector','$apiRootCM', function (Query,$injector,$apiRootCM) {

    var ClassService = {
        saveColor : function (data) {
            return Query.request('POST',$apiRootCM+'class/save-color',{data: data});
        },
        list : function (incidentId) {
            return Query.request('GET',$apiRootCM+'class/list?incidentId=' + incidentId,{});
        },
        update : function (data) {
            return Query.request('POST',$apiRootCM+'class/update',{data: data});
        },
        savedCategories : function (data) {
            return Query.request('POST',$apiRootCM+'class/saved-categories',{data: data});
        },
        save : function (data) {
            return Query.request('POST',$apiRootCM+'class/save',{data: data});
        },
        savedCategoriesOnEdit : function (data) {
            return Query.request('POST',$apiRootCM+'class/saved-categories-on-edit',{data: data});
        },
        newMessage : function (data) {
            return Query.request('POST',$apiRootCM+'class/new-message',data);
        },
        subClassSave : function (data) {
            return Query.request('POST',$apiRootCM+'class/sub-class/save',{data: data});
        },
        updateIndex : function (data) {
            return Query.request('POST',$apiRootCM+'class/update-index',data);
        },
        delete : function (obj) {
            return Query.request('DELETE',$apiRootCM+'class/remove/' + obj.id + '/' + obj.incidentId,{});
        },
        all : function (incidentId) {
            return Query.request('GET',$apiRootCM+'class/all?incidentId=' + incidentId,{});
        },
        subUpdate : function (data) {
            return Query.request('POST',$apiRootCM+'class/sub/update',{data: data});
        },
        categorySave : function (data) {
            return Query.request('POST',$apiRootCM+'class/category/save',{data: data});
        },
        allCategories : function () {
            return Query.request('GET',$apiRootCM+'class/all-categories',{});
        },
        subClassAll : function (classId) {
            return Query.request('GET',$apiRootCM+'class/sub-class/all?classId=' + classId,{});
        },
    };
    return ClassService;
}]);
