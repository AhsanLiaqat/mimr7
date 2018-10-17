
var redis = require('redis');

var client = module.exports.client = redis.createClient(process.env.REDIS);


var getClient = module.exports.getClient = function(){
    return redis.createClient(process.env.REDIS);
}


module.exports.subscribe = function(){

}

var cl = getClient();
module.exports.publish = function(data, channel){
    channel = channel || process.env.REDIS_CHANNEL;

    // console.log("publish", channel, data)

    if (typeof data !== 'string'){
        data = JSON.stringify(data);
    }

    cl.publish(channel, data);
}
