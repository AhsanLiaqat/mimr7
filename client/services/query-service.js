angular.module('app').factory('Query', ['$cookies','$filter','filterFilter','$injector', function ($cookies,$filter,filterFilter,$injector) {

    var Query = {};

    Query.getCookie = function (key,parsing) {
        return ($cookies.get(key))? ((parsing == false)? $cookies.get(key): JSON.parse($cookies.get(key))) : undefined;
    };
    Query.setCookie = function (key,data,expiry) {
        (expiry)? $cookies.put(key, data,expiry): $cookies.put(key, data);
    };
    Query.delCookie = function (key) {
        $cookies.remove(key);
    };
    Query.sort = function (arr, attr, reverse, date) {
    	var sorted = (date == true)? _.sortBy(arr, function (o) { return new Date(o[attr]);}) : $filter('orderBy')(arr, attr)
    	return (reverse)? sorted.reverse() : sorted;
    };
    Query.filter = function (arr, hash, first) {
        return (first)? filterFilter(arr, hash)[0] : filterFilter(arr, hash);
    };
    Query.request = function (method, url, data) {
        if(method === 'UPLOAD'){
            var Upload = $injector.get('Upload');
            return Upload.upload({
             url: url ,
             data: data
            })
        }else{
            var $http = $injector.get('$http');
            return $http({
              method: method,
              url: url,
              data : data
            });
        }
    };
    return Query;

}]);


// angular.module('app').factory("Query", [
//   "$resource", function($resource) {
//     var Resource, tr_array, tr_obj;
//     tr_obj = function(data, header) {
//       var item, obj;
//       if (data.startsWith('{')) {
//         item = angular.fromJson(data);
//         item.day_m = moment(item.day);
//         obj = new Resource(item);
//         return obj;
//       } else {
//         return null;
//       }
//     };
//     tr_array = function(data, header) {
//       var items;
//       if (data.startsWith('[')) {
//         items = angular.fromJson(data);
//         angular.forEach(items, function(item, idx) {
//           item.day_m = moment(item.day);
//           return items[idx] = new Resource(item);
//         });
//       } else {
//         items = [];
//       }
//       return items;
//     };
//     Resource = $resource("/vacation/:id", {
//       id: '@id'
//     }, {
//       update: {
//         method: "PUT",
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_obj
//       },
      
//       save: {
//         method: 'POST',
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_obj
//       },
//       get: {
//         method: 'GET',
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_obj
//       },
//       change_active: {
//         method: 'GET',
//         // isArray: true,
//         url: '/vacation/change_active',
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_array
//       },
//       add_reason: {
//         method: 'GET',
//         isArray: true,
//         url: '/vacation/add_reason',
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_array
//       },
//       query: {
//         method: 'GET',
//         isArray: true,
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_array
//       },
//       get_reasons: {
//         method: 'GET',
//         isArray: true,
//         url: '/vacation/get_reasons',
//         headers: {
//           'content-type': 'application/json'
//         },
//         transformResponse: tr_array
//       }
//     });
//     return Resource;
//   }
// ]);
