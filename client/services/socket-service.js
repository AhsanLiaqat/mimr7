// (function () {
//   'use strict';
//
//   angular.module('app')
//     .service('socket', socket);
//
//   /** @ngInject */
//   function socket($q, $rootScope, $http, $location, $window) {
//           var self = this;
//
//
//           var host = window.document.location.host.replace(/:.*/, '');
//           host = (host === 'localhost' ? 'localhost:8888/websocket' : host+':443/websocket');
//           var baseUrl = (host === 'localhost:8888/websocket' ? 'ws://' : 'wss://');
//           console.log("connect socket", baseUrl, host)
//
//           self.initWS = function(){
//               self.ws = new WebSocket(baseUrl + host, null, {
//                   reconnectIfNotNormalClose: true,
//                   maxTimeout: 30 * 60 * 1000
//               });
//               self.ws.onopen = function (res) {
//                   if (self.timer){
//                           window.clearInterval(self.timer);
//                           self.timer = null;
//                   }
//
//                   self.ws.send("connected");
//
//                   self.ws.onclose = function(){
//                     //try to reconnect in 5 seconds
//                     console.log("socket close")
//                       self.timer = window.setInterval(function(){self.initWS()}, 1000);
//                     };
//
//                       self.ws.onmessage = function (response) {
//                         console.log("service ws - message", response);
//
//                         if (response.data !== 'Hello') {
//                               var reply = JSON.parse(response.data);
//
//                               if (reply.type == "info"){
//                             	  self.info = reply;
//                               }else{
//                             	  self.notify(reply.type, reply);
//                               }
//                           }
//
//                       }
//
//               }
//
//           }
//           self.initWS();
//
//       self.sub = function(event){
//         console.log('this is the event', event);
//     	  self.ws.send(JSON.stringify({action:'subscribe',
//     		  							channel: event}));
//
//       };
//
//       self.subscribe = function(scope, event, callback){
//         //console.log("subscribe", event);
//         var handler = $rootScope.$on('ws-' + event, callback);
//           if (!scope._ws_events){
//                 scope._ws_events = [];
//           }
//           scope._ws_events.push([event, handler]);
//         scope.$on('$destroy', handler);
//         self.sub(event);
//       }
//
//       self.notify = function(event, data){
//         //console.log("emit", event, data)
//         $rootScope.$emit('ws-' + event, data);
//       }
//
//       self.unsubscribe = function(scope, event){
//         if (scope._ws_events){
//                 scope._ws_events = scope._ws_events.filter(function(handler){
//                         if (handler[0] == event){
//                                 handler[1]();
//                                 return false;
//                         }
//                         return true;
//                 });
//         }
//       }
//
//       self.unsubscribeAll = function(scope){
//         if (scope._ws_events){
//                 scope._ws_events = scope._ws_events.filter(function(handler){
//                                 handler[1]();
//                                 return false;
//                 });
//         }
//       }
//           return self;
//   }
//
// })();
