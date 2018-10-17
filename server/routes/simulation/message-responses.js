var express = require('express');
var router = express.Router();
var model = require('../../models');


router.post("/save", function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    model.message_response.findOrCreate({where: {templatePlanMessageId: req.body.data.templatePlanMessageId,gamePlanTemplateId : req.body.data.gamePlanTemplateId,gamePlayerId: req.body.data.gamePlayerId,content: req.body.data.content}}).spread(function(messageResponse) {
        model.message_response.findOne({
            where: {templatePlanMessageId: req.body.data.templatePlanMessageId, gamePlanTemplateId: req.body.data.gamePlanTemplateId,isDeleted:false, gamePlayerId :req.body.data.gamePlayerId},
        }).then(function (response) {
        	model.message_response.update(req.body.data,
        		{where: {templatePlanMessageId: req.body.data.templatePlanMessageId, gamePlanTemplateId: req.body.data.gamePlanTemplateId,isDeleted:false, gamePlayerId :req.body.data.gamePlayerId}})
        	.then(function(result) {
            	res.send(result);
        	});
        });
    });
});

router.get('/all/:templateGameId/:userId', function (req, res, next) {
    model.message_response.findAll({
        where: { gamePlanTemplateId: req.params.templateGameId,isDeleted:false},
            include: [{ model: model.template_plan_message,
                include: [
                    { model: model.game_message,require: true }]
            },
            {model : model.game_player}]
    }).then(function (response) {
        res.send(response);
    });
});

module.exports = router;