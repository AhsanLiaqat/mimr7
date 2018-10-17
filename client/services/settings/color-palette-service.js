angular.module('app').factory('ColorPaletteService', ['Query','$injector','$apiRootSettings', function (Query,$injector,$apiRootSettings) {

    var ColorPaletteService = {
        list : function () {
            return Query.request('GET',$apiRootSettings+'color-palettes/list',{});
        },
        defaultColors : function (id) {
            return Query.request('POST',$apiRootSettings+'color-palettes/default-colors?userAccountId=' + id,{});
        },
        delete : function (id) {
            return Query.request('DELETE',$apiRootSettings+'color-palettes/remove/'+id,{});
        },
        save : function (data) {
            return Query.request('POST',$apiRootSettings+'color-palettes/save/',{data: data});
        },
    };
    return ColorPaletteService;
}]);