var express = require('express');
var router = express.Router();
var model = require('../../models');

router.post("/save", function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    model.archive_message.findOrCreate({
        where: {templatePlanMessageId: req.body.data.templatePlanMessageId,gamePlanTemplateId : req.body.data.gamePlanTemplateId,gamePlayerId: req.body.data.gamePlayerId}
    }).then(function(archiveMessage) {
        if(archiveMessage){
            console.log('*****************************')
            model.archive_message.findOne({
                where: {templatePlanMessageId: req.body.data.templatePlanMessageId, gamePlanTemplateId: req.body.data.gamePlanTemplateId,isDeleted:false, gamePlayerId :req.body.data.gamePlayerId},
                    include: [{ model: model.template_plan_message,
                        include: [
                            { model: model.game_message,require: true }]
                    }]
            }).then(function (response) {
                res.send(response);
            });
        }else{
            res.send('not found');
        }
    });
});

router.get('/all/:templateGameId/:userId', function (req, res, next) {
    model.archive_message.findAll({
        where: { gamePlanTemplateId: req.params.templateGameId,isDeleted:false, gamePlayerId :req.params.userId},
            include: [{ model: model.template_plan_message,
                include: [
                    { model: model.game_message,require: true }]
            }]
    }).then(function (response) {
        res.send(response);
    });
});

module.exports = router;