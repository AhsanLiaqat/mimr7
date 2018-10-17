var express = require('express');
var router = express.Router();
var model = require('../../models');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var fs = require('fs');
var path = require('path');
var socket = require('../../lib/socket');
var _ = require('underscore');
var Q = require('q');
var async = require('async')
var waterfall = require('async-waterfall');

router.get('/get', function(req, res, next) {
    model.user_accounts.findOne({ where: { id: req.query.id }}).then(function   (references) {
        res.send(references);
    });
});

router.get('/get-admin', function(req, res, next) {
    model.user.findOne({ where: { userAccountId: req.query.id, role: 'admin' }}).then(function   (user) {
        res.send(user);
    });
});

router.post('/check-name', function(req, res, next) {
    model.user_accounts.findOne({ where: { organizationName: req.body.data.organizationName }}).then(function   (references) {
        res.send(references);
    });
});

router.get('/all', function(req, res, next) {
    model.user_accounts.findAll({ where: {isDeleted: false } }).then(function   (references) {
        res.send(references);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    model.user_accounts.create(record).then(function(references) {
        res.send(references);

    });
});

router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.user_accounts.update(req.body.data, {where: { id : req.body.data.id }}).then(function(references) {
        res.send(references);
        // var data ={};
        // data.type = "incident_update:" + inci_checklist.incidentId;
        // data.plan = inci_checklist;
        // socket.notify(data.type, data);
    });
});

router.post('/copy-messages', function(req, res, next) {
    var record = req.body.data;
    model.custom_message.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromMessages){
        _.each(fromMessages, function (msg){
            model.custom_message.findOne({
                where: {userAccountId: record.accountIdTo, msgType: msg.msgType}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    var toData = {};
                    toData.subject = msg.subject;
                    toData.content = msg.content;
                    toData.msgTemplateType = msg.msgTemplateType;
                    toData.userAccountId = record.accountIdTo;
                    model.custom_message.update(toData, { where: { id: toMsg.id } }).then(function (response) {
                    // res.send(response);
                    });
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.subject = msg.subject;
                    toData.content = msg.content;
                    toData.msgType = msg.msgType;
                    toData.msgTemplateType = msg.msgTemplateType;
                    toData.userAccountId = record.accountIdTo;
                    model.custom_message.create(toData);
                    console.log("===============>>>>>>> not found")
                }
            })
        });
        res.send(200);
    });
});
router.post('/copy-departments', function(req, res, next) {
    var record = req.body.data;
    model.department.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromMessages){
        _.each(fromMessages, function (msg){
            model.department.findOne({
                where: {userAccountId: record.accountIdTo, name: msg.name}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.name = msg.name;
                    toData.status = msg.status;
                    toData.userAccountId = record.accountIdTo;
                    model.department.create(toData);
                }
            })
        });
        res.send(200);
    });
});

var gameDataSave = function(fromGame,idMade,toAccountId){
    waterfall([
      function(callback){
        if(fromGame.roles && fromGame.roles.length > 0){
            var gameTeams = [];
            var rolePromises = [];
            var roleList = [];
            var teamPromises = [];
            var teamList = [];
            _.each(fromGame.roles, function (fromRole,ind){
                if (fromRole.game_plan_team){
                    putData(fromRole.game_plan_team.name,gameTeams,fromRole,fromRole.game_plan_team.id);
                }else{
                    putData('N/A',gameTeams,fromRole,null);
                }
            });
            var filterGameTeams = gameTeams.filter(function checkAdult(catgry) {return catgry.name != 'N/A';});
            _.each(filterGameTeams, function (rol,ind){
                var toData = {};
                toData.name = rol.name;
                toData.gamePlanId = idMade;
                toData.userAccountId = toAccountId;
                teamPromises.push(model.game_plan_team.create(toData));
            });

            Q.allSettled(teamPromises).done(function (responses) {
                teamList = _.map(responses, function (t,ind) { return {
                    old: filterGameTeams[ind].id,
                    new: t.value.id
                }});
                _.each(fromGame.roles, function (fromRole,ind){
                    var toData = {};
                    toData.name = fromRole.name;
                    toData.description = fromRole.description;
                    toData.gamePlanId = idMade;
                    toData.order = fromRole.order;
                    if(fromRole.gamePlanTeamId){
                        _.each(teamList, function (findTeam){
                            if(findTeam.old == fromRole.gamePlanTeamId){
                                toData.gamePlanTeamId = findTeam.new;
                            }
                        });
                    }

                    toData.userAccountId = toAccountId;
                    rolePromises.push(model.game_role.create(toData));
                });
                Q.allSettled(rolePromises).done(function (respnses) {
                    roleList = _.map(respnses, function (t,ind) { return {
                        old: fromGame.roles[ind].id,
                        new: t.value.id
                    } });
                    callback(null,roleList);
                });
            });
            if(teamPromises.length == 0){
                _.each(fromGame.roles, function (fromRole,ind){
                    var toData = {};
                    toData.name = role.name;
                    toData.description = role.description;
                    toData.gamePlanId = idMade;
                    toData.order = role.order;

                    toData.userAccountId = toAccountId;
                    rolePromises.push(model.game_role.create(toData));
                    Q.allSettled(rolePromises).done(function (rsponses) {
                        roleList = _.map(rsponses, function (t,ind) { return {
                            old: fromGame.roles[ind].id,
                            new: t.value.id
                        } });
                        callback(null,roleList);
                    });
                });
            }
            //team length zero , create roles
        }else{
            callback(null,[]);
        }
      },
      function(roleList, callback){
        var libPromises = [];
        var libList = [];
        if(fromGame.game_libraries){
            _.each(fromGame.game_libraries, function (fromLib,ind){
                var toData = {};
                toData.title = fromLib.title;
                toData.author = fromLib.author;
                toData.description = fromLib.description;
                toData.links = fromLib.links;
                toData.filename = fromLib.filename;
                toData.url = fromLib.url;
                toData.type = fromLib.type;
                toData.mimetype = fromLib.mimetype;
                toData.gamePlanId = idMade;

                toData.userAccountId = toAccountId;
                libPromises.push(model.game_library.create(toData));
            })
            Q.allSettled(libPromises).done(function (rspnss) {
                var libList = _.map(rspnss, function (t,ind) { return {
                    old: fromGame.game_libraries[ind].id,
                    new: t.value.id
                } });
                callback(null,roleList,libList);
            });

        }else{
            callback(null,roleList, []);
        }
      },
      function(roleList,libList, callback){
        if(fromGame.game_messages){
            var msgPromises = []
                var rolesForMessage = [];
            _.each(fromGame.game_messages, function (fromMsg,ind){
                var toData = {};
                toData.name = fromMsg.name;
                toData.author = fromMsg.author;
                toData.links = fromMsg.links;
                toData.context = fromMsg.context;
                toData.type = fromMsg.type;
                toData.order = fromMsg.order;
                toData.gamePlanId = idMade;
                if(fromMsg.libId){
                    _.each(libList, function (findLib){
                        if(findLib.old == fromMsg.libId){
                            toData.libId = findLib.new;
                        }
                    });
                }
                rolesForMessage.push([]);
                if(fromMsg.assigned_game_message && fromMsg.assigned_game_message.roles){
                    _.each(roleList, function (listRole){
                        _.each(fromMsg.assigned_game_message.roles, function (assignRole){
                            if(listRole.old == assignRole.id){
                                rolesForMessage[ind].push(listRole.new)
                            }
                        });  
                    });
                }
                toData.userAccountId = toAccountId;
                var messagesPromises = [];
                msgPromises.push(model.game_message.create(toData));
            })
            Q.allSettled(msgPromises).done(function (resp) {
                var assignMsgPromisses = [];
                _.each(resp, function (dbMsg,indxxx){
                    var assignMsg = {gameMessageId: dbMsg.value.id,userAccountId: toAccountId};
                    assignMsgPromisses.push(model.assigned_game_message.create(assignMsg)
                    .then(function (assignedMessage) {
                        assignedMessage.addRoles(rolesForMessage[indxxx]);
                    }));
                });
                Q.allSettled(assignMsgPromisses).done(function (respp) {
                    callback(null, 'done');
                });
            });
        }else{
            callback(null, 'done');
        }
      }
    ], function (err, result) {
        return;
      // result now equals 'done'
    });
}
var putData = function(search,cat,inc,searchId){
    var type = cat.filter(function checkAdult(catgry) {return catgry.name == search;})[0];
    if(type){
        type.data.push(inc);
    }else{
        cat.push({name: search,data: [],id:searchId});
        var type = cat.filter(function checkAdult(catgry) {return catgry.name == search;})[0];
        type.data.push(inc);
    }
}

router.post('/copy-simulation-games', function(req, res, next) {
    var record = req.body.data;
    model.game_plan.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false},
        include:[{
                model: model.game_role,
                require: false,
                as: 'roles',
                include:[{
                    model: model.game_plan_team,
                    require: false
                }]
            },{
                model: model.game_library,
                require: false
            },{
                model: model.game_message,
                require: false,
                include:[{
                    model: model.assigned_game_message,
                    require: false,
                    include:[{
                        model: model.game_role,
                        require: false,
                        as: 'roles'
                    }]
                }]
            },{
                model: model.game_category,
                require: false
            }]
        }).then(function(gamePlans){
        var promises = [];
        var categories = [];
        _.each(gamePlans, function (plan,ind){
            promises.push(model.game_plan.findOne({
                where: {userAccountId: record.accountIdTo, name: plan.name}
            }).then(function(exist){
                if(exist && exist.id){
                    console.log('------------------- found');
                }
                else{
                    if (plan.game_category){
                        putData(plan.game_category.name,categories,plan,plan.game_category.name);
                    }else{
                        putData('N/A',categories,plan,null);
                    }
                }
            }));
        });
        Q.allSettled(promises).done(function (responses) {
            _.each(categories, function (catgry,ind){
                if(catgry.name != 'N/A'){
                    var toCategory = {};
                    toCategory.name = catgry.name;
                    toCategory.userAccountId = record.accountIdTo;
                    model.game_category.create(toCategory).then(function (categoryMade) {
                        _.each(catgry.data, function (plan,indx){
                            // console.log('--------------------------------',ind,categoryMade.id);
                            var toData = {};
                            toData.name = plan.name;
                            toData.description = plan.description;
                            toData.planDate = plan.planDate;
                            toData.gameCategoryId = categoryMade.id;

                            toData.userAccountId = record.accountIdTo;
                            model.game_plan.create(toData).then(function (gameMade) {
                                gameDataSave(plan,gameMade.id,record.accountIdTo)
                            });
                        });
                    });
                }else{
                    _.each(catgry.data, function (plan,indx){
                        var toData = {};
                        toData.name = plan.name;
                        toData.description = plan.description;
                        toData.planDate = plan.planDate;

                        toData.userAccountId = record.accountIdTo;
                        model.game_plan.create(toData).then(function (gameMade) {
                            gameDataSave(plan,gameMade.id,record.accountIdTo)
                        });
                    });
                }
            });
        });
        res.send(200);
    });
});


// var gameDataSave = function(fromGame,idMade,toAccountId){
//     if(fromGame.roles){
//         var gameRoles = [];
//         _.each(fromGame.roles, function (fromRole,ind){
//             if (fromRole.game_plan_team){
//                 putData(fromRole.game_plan_team.name,gameRoles,fromRole);
//             }else{
//                 putData('N/A',gameRoles,fromRole);
//             }
//         });
//         _.each(gameRoles, function (rol,ind){
//             if(rol.name != 'N/A'){
//                 var toData = {};
//                 toData.name = rol.name;
//                 toData.gamePlanId = idMade;
//                 toData.userAccountId = toAccountId;
//                 model.game_plan_team.create(toData).then(function (gamePLanTeamMade) {
//                     _.each(rol.data, function (role,indx){
//                         // console.log('--------------------------------',ind,categoryMade.id);
//                         var toData = {};
//                         toData.name = role.name;
//                         toData.description = role.description;
//                         toData.gamePlanId = idMade;
//                         toData.order = role.order;
//                         toData.gamePlanTeamId = gamePLanTeamMade.id;

//                         toData.userAccountId = toAccountId;
//                         model.game_role.create(toData).then(function (rolMade) {
//                         });
//                     });
//                 });
//             }else{
//                 _.each(rol.data, function (role,indx){
//                     var toData = {};
//                     toData.name = role.name;
//                     toData.description = role.description;
//                     toData.gamePlanId = idMade;
//                     toData.order = role.order;
//                     toData.userAccountId = toAccountId;
//                     model.game_role.create(toData);
//                 });
//             }
//         });
//     }
//     var promises = [];
//     if(fromGame.game_libraries){
//         _.each(fromGame.game_libraries, function (fromLib,ind){
//             var toData = {};
//             toData.title = fromLib.title;
//             toData.author = fromLib.author;
//             toData.description = fromLib.description;
//             toData.links = fromLib.links;
//             toData.filename = fromLib.filename;
//             toData.url = fromLib.url;
//             toData.type = fromLib.type;
//             toData.mimetype = fromLib.mimetype;
//             toData.gamePlanId = idMade;

//             toData.userAccountId = toAccountId;
//             promises.push(model.game_library.create(toData));
//         })
//     }
//     Q.allSettled(promises).done(function (responses) {
//         var list = _.map(responses, function (t,ind) { return {
//             old: fromGame.game_libraries[ind].id,
//             new: t.value.id
//         } });
//         if(fromGame.game_messages){
//             _.each(fromGame.game_messages, function (fromMsg,ind){
//                 var toData = {};
//                 toData.name = fromMsg.name;
//                 toData.author = fromMsg.author;
//                 toData.links = fromMsg.links;
//                 toData.context = fromMsg.context;
//                 toData.type = fromMsg.type;
//                 toData.order = fromMsg.order;
//                 toData.gamePlanId = idMade;
//                 if(fromMsg.libId){
//                     _.each(list, function (findLib,ind){
//                         if(findLib.old == fromMsg.libId){
//                             toData.libId = findLib.new;
//                         }
//                     });
//                 }
//                 toData.userAccountId = toAccountId;
//                 model.game_message.create(toData);
//             })
//         }
//     });
//     if(promises.length == 0){
//         _.each(fromGame.game_messages, function (fromMsg,ind){
//             var toData = {};
//             toData.name = fromMsg.name;
//             toData.author = fromMsg.author;
//             toData.links = fromMsg.links;
//             toData.context = fromMsg.context;
//             toData.type = fromMsg.type;
//             toData.order = fromMsg.order;
//             toData.gamePlanId = idMade;
            
//             toData.userAccountId = toAccountId;
//             model.game_message.create(toData);
//         })
//     }
// }

// var putData = function(search,cat,inc){
//     var type = cat.filter(function checkAdult(catgry) {return catgry.name == search;})[0];
//     if(type){
//         type.data.push(inc);
//     }else{
//         cat.push({name: search,data: []});
//         var type = cat.filter(function checkAdult(catgry) {return catgry.name == search;})[0];
//         type.data.push(inc);
//     }
// }

// router.post('/copy-simulation-games', function(req, res, next) {
//     var record = req.body.data;
//     model.game_plan.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false},
//         include:[{
//                 model: model.game_role,
//                 require: false,
//                 as: 'roles',
//                 include:[{
//                     model: model.game_plan_team,
//                     require: false
//                 }]
//             },{
//                 model: model.game_library,
//                 require: false
//             },{
//                 model: model.game_message,
//                 require: false
//             },{
//                 model: model.game_category,
//                 require: false
//             }]
//         }).then(function(fromMessages){
//         var promises = [];
//         var categories = [];
//         _.each(fromMessages, function (msg,ind){
//             promises.push(model.game_plan.findOne({
//                 where: {userAccountId: record.accountIdTo, name: msg.name}
//             }).then(function(exist){
//                 if(exist && exist.id){
//                     console.log('------------------- found');
//                 }
//                 else{
//                     if (msg.game_category){
//                         putData(msg.game_category.name,categories,msg);
//                     }else{
//                         putData('N/A',categories,msg);
//                     }
//                 }
//             }));
//         });
//         Q.allSettled(promises).done(function (responses) {
//             _.each(categories, function (catgry,ind){
//                 if(catgry.name != 'N/A'){
//                     var toCategory = {};
//                     toCategory.name = catgry.name;
//                     toCategory.userAccountId = record.accountIdTo;
//                     model.game_category.create(toCategory).then(function (categoryMade) {
//                         _.each(catgry.data, function (plan,indx){
//                             // console.log('--------------------------------',ind,categoryMade.id);
//                             var toData = {};
//                             toData.name = plan.name;
//                             toData.description = plan.description;
//                             toData.planDate = plan.planDate;
//                             toData.gameCategoryId = categoryMade.id;

//                             toData.userAccountId = record.accountIdTo;
//                             model.game_plan.create(toData).then(function (gameMade) {
//                                 gameDataSave(plan,gameMade.id,record.accountIdTo)
//                             });
//                         });
//                     });
//                 }else{
//                     _.each(catgry.data, function (plan,indx){
//                         var toData = {};
//                         toData.name = plan.name;
//                         toData.description = plan.description;
//                         toData.planDate = plan.planDate;

//                         toData.userAccountId = record.accountIdTo;
//                         model.game_plan.create(toData).then(function (gameMade) {
//                             gameDataSave(plan,gameMade.id,record.accountIdTo)
//                         });
//                     });
//                 }
//             });
//         });
//         res.send(200);
//     });
// });

router.post('/copy-information-games', function(req, res, next) {
    var record = req.body.data;
    model.id_game.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false},
        include:[{
                model: model.id_message
        }]
    }).then(function(fromGames){
        _.each(fromGames, function (idGame){
            model.id_game.findOne({
                where: {userAccountId: record.accountIdTo, name: idGame.title}
            }).then(function(toGame){
                if(toGame && toGame.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.name = idGame.name;
                    toData.userAccountId = record.accountIdTo;
                    model.id_game.create(toData).then(function(gameCreate){
                        _.each(idGame.id_messages, function (msg){
                            var toData = {};
                            toData.message = msg.message;
                            toData.order = msg.order;
                            toData.idGameId = gameCreate.id;
                            toData.userAccountId = record.accountIdTo;
                            model.id_message.create(toData);
                        });
                    });
                }
            })
        });
        res.send(200);
    });
});

router.post('/copy-tasks', function(req, res, next) {
    var record = req.body.data;
    console.log('????????????????????????',record);
    model.task_list.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromTasks){
        _.each(fromTasks, function (msg){
            model.task_list.findOne({
                where: {userAccountId: record.accountIdTo, title: msg.title}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.title = msg.title;
                    toData.author = msg.author;
                    toData.description = msg.description;
                    toData.links = msg.links;
                    toData.filename = msg.filename;
                    toData.type = msg.type;
                    toData.dateOfUpload = msg.dateOfUpload;
                    toData.for_template = msg.for_template;
                    toData.userAccountId = record.accountIdTo;
                    model.task_list.create(toData);
                }
            })
        });
        res.send(200);
    });
});

router.post('/copy-dynamic-forms', function(req, res, next) {
    var record = req.body.data;
    console.log('????????????????????????',record);
    model.dynamic_form.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromDynamicForm){
        _.each(fromDynamicForm, function (msg){
            model.dynamic_form.findOne({
                where: {userAccountId: record.accountIdTo, name: msg.name}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.name = msg.name;
                    toData.heading = msg.heading;
                    toData.formTypeId = msg.formTypeId;
                    toData.fields = msg.fields;
                    toData.refrenceTable = msg.refrenceTable;
                    toData.refrenceId = msg.refrenceId;
                    toData.userAccountId = record.accountIdTo;
                    model.dynamic_form.create(toData);
                }
            })
        });
        res.send(200);
    });
});


router.post('/copy-colors', function(req, res, next) {
    var record = req.body.data;
    model.color_palette.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(from){
        _.each(from, function (color){
            model.color_palette.findOne({
                where: {
                    userAccountId: record.accountIdTo,
                    $or: [{
                        color: color.color
                    }, {
                        name: color.color
                    }]
                }
            }).then(function(to){
                if(to && to.id){
                    console.log("===============>>>>>>> found")

                }else{
                    var toData = {};
                    toData.name = color.name;
                    toData.color = color.color;
                    toData.userAccountId = record.accountIdTo;
                    model.color_palette.create(toData);
                }
            })
        });
        res.send(200);
    });
});

router.post('/copy-incident-types', function(req, res, next) {
    var record = req.body.data;
    model.category.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromMessages){
        _.each(fromMessages, function (msg){
            model.category.findOne({
                where: {userAccountId: record.accountIdTo, name: msg.name}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.name = msg.name;
                    toData.userAccountId = record.accountIdTo;
                    model.category.create(toData);
                }
            })
        });
        res.send(200);
    });
});

router.post('/copy-roles', function(req, res, next) {
    var record = req.body.data;
    model.role.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromMessages){
        _.each(fromMessages, function (msg){
            model.role.findOne({
                where: {userAccountId: record.accountIdTo, name: msg.name}
            }).then(function(toMsg){
                if(toMsg && toMsg.id){
                    console.log("===============>>>>>>> found")
                }else{
                    var toData = {};
                    toData.name = msg.name;
                    toData.userAccountId = record.accountIdTo;
                    model.role.create(toData);
                }
            })
        });
        res.send(200);
    });
});

router.post('/copy-categories', function(req, res, next) {
    var record = req.body.data;
    model.all_category.findAll({where: {userAccountId: record.accountIdFrom,isDeleted:false}}).then(function(fromCategories){
        _.each(fromCategories, function (cat){
          var toData = {};
          toData.name = cat.name;
          toData.description = cat.description;
          toData.type = cat.type;
          toData.position = cat.position;
          toData.userAccountId = record.accountIdTo;
          model.all_category.create(toData);
        });
        res.send(200);
    });
});

router.get('/all-organizations', function(req, res, next) {
    var organizations = [];
    model.user_accounts.findAll({where: {id: req.user.userAccountId,isDeleted:false}, attributes: ['id', 'organizationName']})
        .then(function (userAccounts) {
            userAccounts.forEach(function(userAccount) {
                organizations.push({
                    id: userAccount.id,
                    name: userAccount.organizationName,
                    group: 'Internal Organizations'
                })
            });
            model.organization.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false}, attributes: ['id', 'name']})
                .then(function(externalOrganizations){
                    externalOrganizations.forEach(function(externalOrganization) {
                        organizations.push({
                            id: externalOrganization.id,
                            name: externalOrganization.name,
                            group: 'External Organizations'
                        })
                    });
                    res.send(organizations);
                })
        });
});

router.get("/all-incidents", function(req, res, next) {
    model.incident.findAll({ where: {
        active: 'Active',
        isDeleted:false
    }, include:[{
        model: model.place,
        require: false,
        as: 'locations'
    },{
        model: model.action_plan,
        require: false
    }]}).then(function(response) {
        var data = response.map(function(incident) {
            incident = incident.toJSON();
            var locs = incident.locations.map(function(loc){
                return {
                    id: loc.id,
                    address: loc.location.formatted_address,
                    geometry: loc.location.geometry.location
                }
            });
            incident.locations = locs;
            return incident;
        });
        res.send(data);
    }, function(err) {
        console.log(err);
        res.send()
    });
});

router.get('/get-counts', function(req, res, next) {
    var count = {
        user_count: 0,
        team_count: 0,
        organization_count: 0,
        task_count: 0,
        activity_count: 0,
        action_plan_count: 0,
        department_count: 0,
        role_count: 0,
        categories_count: 0
    };

    model.user.findAll({
        where: { userAccountId: req.query.userAccountId, isDeleted:false, userType: null }
    }).then(function (users) {
        count.user_count = users.length;

        model.incidents_team.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
            .then(function(teams) {
                count.team_count = teams.length;

                model.organization.findAll({ where: {userAccountId: req.query.userAccountId}})
                    .then(function(organizations) {
                        count.organization_count = organizations.length;

                        model.task_list.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                            .then(function(tasks) {
                                count.task_count = tasks.length;

                                model.activity.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                    .then(function(activities) {
                                        count.activity_count = activities.length;

                                        model.action_plan.findAll({ where: { userAccountId: req.query.userAccountId, isDeleted:false } })
                                            .then(function (actionPlans) {
                                                count.action_plan_count = actionPlans.length;

                                                model.department.findAll({ where: { userAccountId: req.query.userAccountId, isDeleted:false } })
                                                    .then(function (departments) {
                                                        count.department_count = departments.length;
                                                        model.role.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}}).then(function(roles) {
                                                                    count.role_count = roles.length;
                                                            model.category.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                .then(function(categories) {
                                                                    count.categories_count = categories.length;
                                                                    model.checkList.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                        .then(function(check) {
                                                                            count.checklist_count = check.length;

                                                                            model.default_category.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                .then(function(dc) {
                                                                                    count.dcategories_count = dc.length;

                                                                                    model.color_palette.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                        .then(function(check) {
                                                                                            count.colors_count = check.length;

                                                                                            model.library_reference.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                                .then(function(ref) {
                                                                                                    count.references_count = ref.length;

                                                                                                    model.custom_message.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                                        .then(function(msgs) {
                                                                                                            count.msgs_count = msgs.length;

                                                                                                            model.all_category.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                                                .then(function(cat) {
                                                                                                                    count.cat_count = cat.length;

                                                                                                                    model.capacity.findAll({where: {userAccountId: req.query.userAccountId, isDeleted:false}})
                                                                                                                        .then(function(cap){
                                                                                                                            count.capacity_count = cap.length;

                                                                                                                            res.send(count);
                                                                                                                        });
                                                                                                                });
                                                                                                        });
                                                                                                });
                                                                                        });
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                    });

                                            });
                                    });
                            });
                    });
            });
    });
});


module.exports = router;
