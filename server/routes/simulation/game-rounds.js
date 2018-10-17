var express = require('express');
var router = express.Router();
var model = require('../../models');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('35 * * * * *', function(){
    model.game_plan_template_round.findAll({
        where: {status: true,isDeleted:false},
        attributes: ['id', 'timeleft', 'resume_date','status','gamePlanTemplateId']
    }).then(function(rounds) {
        rounds.forEach(function(round) {
            if(round.resume_date && round.timeleft){
                var round_date = new Date(round.resume_date.getTime() + round.timeleft*1000);
                if(round_date.getFullYear() == new Date().getFullYear() &&
                   round_date.getMonth() == new Date().getMonth() &&
                   round_date.getDay() == new Date().getDay() &&
                   round_date.getHours() == new Date().getHours() &&
                   round_date.getMinutes() == new Date().getMinutes()
                ){
                    model.game_plan_template_round.update({status: false},
                        {where: { id : round.id }})
                    .then(function(result) {
                        round.status = false; 
                        var data = {
                            data: round,
                            action: 'update'
                        }
                        process.io.emit('simulation_active_game_rounds:' + round.gamePlanTemplateId,data);

                        model.game_plan_template.findOne({
                            where: {id: round.gamePlanTemplateId},
                            attributes: ['id','userAccountId','status','roundId','pause_date','resume_date','start_time'],
                            order: [['createdAt', 'DESC']]
                        }).then(function(game) {
                            model.game_plan_template.update({status: 'pause',roundId: game.roundId+1,pause_date: new Date()},
                                {where: { id : game.id }})
                            .then(function(result) {
                                game.status = 'pause';
                                game.roundId = game.roundId+2;
                                game.pause_date = new Date();
                                var data = {
                                    data: game,
                                    action: 'update_at_round_end'
                                }
                                process.io.emit('simulation_active_game:' + game.id,data);
                            });
                        });
                    });
                }
            }
        });
    });
});

router.get('/list/:gameId',function(req,res,next){
    model.game_plan_template_round.findAll({
        where:{
            gamePlanTemplateId: req.params.gameId,
            isDeleted:false
        },
        order: [ ['createdAt', 'DESC'] ]
    }).then(function(response){
        res.send(response);
    });
});

router.post('/create',function(req,res,next){
    model.game_plan_template_round.create(req.body.data)
        .then(function(response){
            res.send(response);
        });
});

router.post('/update/:id', function (req, res, next) {
    //status
    //timeLeft
    var record = req.body.data;
    model.game_plan_template_round.update(record, { where: { id: req.params.id } })
        .then(function (result) {
            model.game_plan_template_round.findOne({
                where: {id: req.params.id}}).then(function(response) {
                var data = {
                    data: response,
                    action: 'update'
                }
                req.app.get('io').emit('simulation_active_game_rounds:' + response.gamePlanTemplateId,data)
                res.send(response);
            });
        })
});

router.delete('/delete/:id', function (req, res, next) {
    model.game_plan_template_round.destroy({
        where: {id: req.params.id}
    }).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_plan_template_round.update({isDeleted:true},{
            where: {id: req.params.id}
        }).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});



module.exports=router;
