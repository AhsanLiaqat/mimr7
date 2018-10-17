var express = require('express');
var router = express.Router();
var model = require('../../models');

router.get('/all/:templateGameId/:userId', function (req, res, next) {
    model.read_message.findAll({
        where: { gamePlanTemplateId: req.params.templateGameId,isDeleted:false, gamePlayerId :req.params.userId}
    }).then(function (response) {
        res.send(response);
    });
});

router.post("/save", function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    model.read_message.findOrCreate({where: {templatePlanMessageId: req.body.data.templatePlanMessageId,gamePlanTemplateId : req.body.data.gamePlanTemplateId,gamePlayerId: req.body.data.gamePlayerId}}).spread(function(readMessage) {
        res.json(readMessage);
    });
});

module.exports = router;