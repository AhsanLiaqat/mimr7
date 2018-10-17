
// var Q = require('q');

// var api = module.exports.api = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// module.exports.send = function(to, message){
//  var deferred = Q.defer();
    
//  api.message.create({
//      to: to,
//      from: process.env.TWILIO_PHONE,
//      message: message
//  }, function(err, message){
//      if (err){
//          deferred.reject(err);
//      } else {
//          deferred.resolve(message);
//      }
//  });
//  return deferred.promise;
// };