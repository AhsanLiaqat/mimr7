angular.module('app').factory("IncidentFactory", [ function () {
var Incident = true;

return Incident;
}]);

// (function () {
//     'use strict';
//     angular.module('app').factory('IncidentFactory',function () {
//         IncidentFactory = {};
//         IncidentFactory.current = function () {
//             console.log('factory called');
//         }
//         return IncidentFactory;
//     });
// }());