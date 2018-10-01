var CH = {wss:{}};
var WebSocketServer = require('ws').Server;
// var rs = require('../lib/rs');

var acc = function(acc){
    var self = this;
    this.acc = acc;
    this.client = rs.getClient();

    this.client.subscribe(acc);
    this.users = [];
    this.addUser = function(userId){
        if (self.users.indexOf(userId) == -1){
            self.users.push(userId);
        }
    };
    this.subscribe = function(channel){
        self.client.subscribe(channel);
    };
    this.client.on('message', function(chan, msg) {
        // use redis pubsub to accept and pass messages on to the
        // sockets

        var task = JSON.parse(msg);

        console.log("PUBSUB SOCKET", chan, acc, task)

        module.exports.broadcast(acc, task);

    });
}

var userSocket = function(userId, ws){
    var self = this;
    this.ws = ws;
    this.userId = userId;
    this.client = rs.getClient();
    this.client.subscribe(userId);
    this.subscribe = function(channel){
        console.log("subscribe", channel)
        self.client.subscribe(channel);
    };
    this.client.on('message', function(chan, msg) {
        // use redis pubsub to accept and pass messages on to the
        // sockets

        var task = JSON.parse(msg);

        console.log("start with ======================================>");
        console.log("USER PUBSUB SOCKET", chan, userId, task)


        try{
            self.ws.send(msg);
        }catch(err){
            console.log("end with ======================================>");

            console.log(err);
        }

    });
}

module.exports.init = function(server, app){
    var wss =  CH.wss = new WebSocketServer({ server: server, path: "/websocket"});
    var userWS = CH.userWS = {};
    var accountUsers = CH.accountUsers = {};
    //websocket
    CH.wss.on('connection', function connection(ws) {
        var models = require('../models');

        // console.log("connection")

        app.sessionParser(ws.upgradeReq, {}, function(){
            var sess = ws.upgradeReq.session;
            if (!sess.passport){
                return;
            }
            var user = sess.passport.user;
            if (user && !userWS[user.id]){
                userWS[user.id] = [];
            }else{
                var user = {}
                user.id = '00000000-0000-0000-0000-100000000000';
                user.userAccountId = '00000000-0000-0000-0000-000000000001';
                userWS[user.id] = [];
            }
            ws.userId = user.id;
            ws.accountId = user.userAccountId;
            if (!(user.userAccountId in accountUsers)){
                accountUsers[user.userAccountId] = new acc(user.userAccountId);
            }

            accountUsers[user.userAccountId].addUser(user.id);


            userWS[user.id].push({opened: new Date(), conn: ws});

            ws.socket = new userSocket(user.id, ws);

            ws._index = userWS[user.id].length;

            models.user.byId(ws.userId).then(function(u){
                if (!u.available){
                    u.available = true;
                    u.save();
                }
            });

            ws.on('open', function(asd) {
                ws.send("Welcome");
            })

            ws.on('message', function incoming(message) {
                if(message === 'connected') {

                    ws.send(JSON.stringify({
                        type: 'info',
                        userId: ws.userId,
                        accountId: ws.accountId
                    }))
                }else{

                    try{
                        var msg = JSON.parse(message);
                        if (msg.action== 'subscribe'){
                            ws.socket.subscribe(msg.channel);
                        }

                    } catch (e){
                        console.log("err", e)
                    }

                }
            });

            ws.on('close', function () {
                console.log('stopping client interval', ws.userId);
                userWS[ws.userId] = userWS[ws.userId].splice(ws._index, 1);
                console.log(userWS[ws.userId]);
                if (userWS[ws.userId].length == 0){
                    models.user.byId(ws.userId).then(function(u){
                        u.available = false;
                        u.save();
                    });
                }
            });



        });



    });

    var client = rs.getClient();

    client.subscribe(process.env.REDIS_CHANNEL);

    client.on('message', function(chan, msg) {
        // use redis pubsub to accept and pass messages on to the
        // sockets

        var task = JSON.parse(msg);

        console.log("PUBSUB SOCKET", task)

        module.exports.broadcast(task);

    });


}
module.exports._broadcast = CH.wss.broadcast = function broadcast(data, owner) {
    console.log("broadcast", CH.wss.clients.length)
    if (typeof data !== 'string'){
        data = JSON.stringify(data);
    }
    CH.wss.clients.every(function(client, idx) {

        if(owner === client) {
        }
        else {
            try{
                client.send(data);
            }catch(err){
                console.log(err)
            }
        }
        return true;
    });
};

module.exports.broadcast  = function (account, data, owner) {
    console.log("broadcast acc")
    if (typeof data !== 'string'){
        data = JSON.stringify(data);
    }

    if (account in CH.accountUsers){
        CH.accountUsers[account].users.forEach(function(userId){
            console.log("==========================================>>>>>>>>>> 1");
            module.exports.sendTo(userId, data);
        })
    }
};


module.exports.sendTo = function (user, data) {

    if (typeof user === 'object'){
        user = user.id;
    }
    console.log("==========================================>>>>>>>>>> 2");

    if (CH.userWS[user]){
        CH.userWS[user].every(function(socket) {
            socket.conn.send(data);
            return true;
        });
    }
};

module.exports.notify  = function (channel, data) {
    rs.publish( data, channel)
}
