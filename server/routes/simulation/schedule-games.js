var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/get/:id', function(req, res, next) {
    model.game_plan_template.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'scheduled_date', 'gamePlanId', 'organizationId', 'userAccountId', 'roles', 'createdAt','roundId','gamePlayerListId'],
        order: [['createdAt', 'DESC']],
        include: [{model: model.game_player_list, attributes: ['id', 'name','description'],
            include: [{ model: model.game_player}]},
            {model: model.user_accounts, attributes: ['id', 'organizationName']},
            {model: model.game_plan, attributes: ['id', 'name']},
            {model: model.template_plan_message, attributes: ['id', 'setOffTime','offset','index'],
                include: [{ model: model.assigned_game_message,

                    attributes: ['id'],
                    include: [  { model: model.game_message,
                        attributes: ['id', 'name'] },
                    { model: model.game_role,
                        as: 'roles',
                        require: false,
                        foreignKey: 'assignedGameMessageId',
                        attributes: ['id', 'name'],
                        through: {attributes: [] }
                    }]
                },
                {
                    model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                    include:[{ model: model.game_library,require: false}]
                }
            ]}]
    }).then(function(game) {
        // game.dataValues.client = game.dataValues.organization ? { id: game.dataValues.organization.id, name: game.dataValues.organization.name, group: 'External Organizations' } : { id: game.dataValues.user_account.id, name: game.dataValues.user_account.organizationName, group: 'Internal Organizations' }
        delete game.dataValues.organization;
        delete game.dataValues.user_account;
        res.send(game);
    });
});

router.get('/play-game-summary/:id', function(req, res, next) {
    model.game_plan_template.findOne({
        where: {id: req.params.id},
        attributes: ['id','roles','status','start_time','gamePlanId','roundId'],
        order: [['createdAt', 'DESC']],
        include: [
            {model: model.incident},
            {model: model.template_plan_message,

            include: [{ model: model.assigned_game_message,
                attributes: ['id'],
                include: [
                    { model: model.game_role,
                        as: 'roles',
                        require: false,
                        foreignKey: 'assignedGameMessageId',
                        attributes: ['id', 'name'],
                        through: {attributes: [] }
                    }]
            },{
                model: model.game_message, attributes: ['id', 'name', 'links','type','context'],
                include:[{ model: model.game_library,
                    require: false}]
            }]
        }]
    }).then(function(game) {
        var users = [];
        _.each(game.dataValues.roles, function (role) {
            users.push(model.game_player.findOne({
                where: { id: role.playerId },
                attributes: ['id', 'email', 'firstName', 'lastName']
            }));
        });

        Q.allSettled(users).then(function (result) {
            _.map(result, function (u, index) {
                game.dataValues.roles[index].user = {};
                game.dataValues.roles[index].user  = u.value;
            });
            res.send(game);
        });
    });
});

router.get('/all', function(req, res, next) {
    model.game_plan_template.findAll({  where: {userAccountId: req.user.userAccountId,isDeleted:false},
        attributes: ['id', 'scheduled_date', 'plan_activated','roundId', 'createdAt','status','start_time','play_date'],
        order: [['createdAt', 'DESC']],
        include: [
            {model: model.game_player_list, attributes: ['id', 'name','description'],
                        include: [{ model: model.game_player}]},
            {model: model.user_accounts, attributes: ['id', 'organizationName']},
            {model: model.game_plan, attributes: ['id', 'name']}]
    })
        .then(function(result) {
            result.forEach(function(game) {
                // game.dataValues.client = game.dataValues.organization ? { id: game.dataValues.organization.id, name: game.dataValues.organization.name, type: 'External' } : { id: game.dataValues.user_account.id, name: game.dataValues.user_account.organizationName, type: 'Internal' }
                delete game.dataValues.organization;
                delete game.dataValues.user_account;
            });
            res.send(result);
        });
});

router.post('/create', function(req, res, next) {
    var record = req.body;
    record.userAccountId = req.user.userAccountId;
    model.game_plan_template.create(record)
        .then(function(gamePlanTmplate) {

            model.game_plan_template.findOne({
                where: {id: gamePlanTmplate.id},
                attributes: ['id', 'scheduled_date', 'createdAt','status','roundId'],
                order: [['createdAt', 'DESC']],
                include: [
                    {model: model.game_player_list, attributes: ['id', 'name','description'],
                        include: [{ model: model.game_player}]},
                    {model: model.user_accounts, attributes: ['id', 'organizationName']},
                    {model: model.game_plan, attributes: ['id', 'name']}]
            }).then(function(game) {
                // game.dataValues.client = game.dataValues.organization ? { id: game.dataValues.organization.id, name: game.dataValues.organization.name, type: 'External' } : { id: game.dataValues.user_account.id, name: game.dataValues.user_account.organizationName, type: 'Internal' }
                delete game.dataValues.organization;
                delete game.dataValues.user_account;
                res.send(game);
            });
        });
});

router.post('/update/:id', function(req, res, next) {
    //start_time
    //status
    //resume_date
    //roundId
    //pause_date
    model.game_plan_template.update(req.body,
        {where: { id : req.params.id }})
        .then(function(result) {
            model.game_plan_template.findOne({
                where: {id: req.params.id},
                attributes: ['id', 'scheduled_date', 'gamePlanId', 'organizationId', 'userAccountId', 'roles', 'createdAt','start_time','status','roundId','play_date','pause_date','resume_date'],
                order: [['createdAt', 'DESC']],
                include: [{model: model.game_plan, attributes: ['id', 'name']}]
                // ,
                // include: [{model: model.organization, attributes: ['id', 'name']},
                //     {model: model.user_accounts, attributes: ['id', 'organizationName']},
                //     {model: model.game_plan, attributes: ['id', 'name']},
                //     {model: model.template_plan_message, attributes: ['id', 'setOffTime'],
                //         include: [{ model: model.assigned_game_message,
                //             attributes: ['id'],
                //             include: [  { model: model.game_message,
                //                 attributes: ['id', 'name'] },
                //             { model: model.game_role,
                //                 as: 'roles',
                //                 require: false,
                //                 foreignKey: 'assignedGameMessageId',
                //                 attributes: ['id', 'name'],
                //                 through: {attributes: [] }
                //             }]
                //         }]
                //     }]
            }).then(function(game) {
                // game.dataValues.client = game.dataValues.organization ? { id: game.dataValues.organization.id, name: game.dataValues.organization.name, type: 'External' } : { id: game.dataValues.user_account.id, name: game.dataValues.user_account.organizationName, type: 'Internal' }
                // delete game.dataValues.organization;
                // delete game.dataValues.user_account;
                var io = req.app.get('io');
                var data = {
                    data: game,
                    action: 'update'
                }
                io.emit('simulation_active_game:' + game.id,data)
                res.send(game);
            });
        });
});

router.delete('/remove/:id', function(req, res, next) {
    model.game_plan_template.destroy({where: {id: req.params.id}})
    .then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_plan_template.update({isDeleted:true},{where: {id: req.params.id}})
        .then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});
router.get('/active-games/:userId', function (req, res, next) {
    model.game_plan_template.findAll({ where: {userAccountId: req.user.userAccountId,isDeleted:false},
        attributes: ['id', 'scheduled_date', 'createdAt', 'roles','roundId'],
        include: [{ model: model.game_plan, attributes: ['id', 'name'] }] })
        .then(function (response) {
            var activeGames = [];
            response.forEach(function (item) {
                var game = item.dataValues;
                var filteredRole = game.roles.filter(function(role) {
                    return role.playerId === req.params.userId;
                });
                filteredRole.length > 0 ? setUserGame(activeGames, game, filteredRole[0]) : '';
            });
            res.send(activeGames);
        });
});
router.get('/player-details/:userId', function (req, res, next) {
    model.game_player.findOne({
        where: {id: req.params.userId},
        order: [['createdAt', 'DESC']],
    }).then(function(user) {
        model.game_plan_template.findAll({ where: {userAccountId: user.userAccountId,isDeleted:false},
            attributes: ['id', 'scheduled_date', 'createdAt', 'roles','roundId','plan_activated','status'],
            include: [
                    { model: model.game_plan, attributes: ['id', 'name'] },
                    { model: model.incident, attributes: ['id', 'name'] }
                ] })
            .then(function (response) {
                var activeGames = [];
                response.forEach(function (item) {
                    var game = item.dataValues;
                    var filteredRole = game.roles.filter(function(role) {
                        return role.playerId === req.params.userId;
                    });
                    filteredRole.length > 0 ? setUserGame(activeGames, game, filteredRole[0]) : '';
                });
                res.send(activeGames);
            });
    });
});

var setUserGame = function(activeGames, game, role) {
    game.role = role.name;
    game.name = game.game_plan.dataValues.name;
    delete game.roles;
    delete game.game_plan;
    activeGames.push(game);
}

module.exports = router;
