var express = require('express');
var router = express.Router();
var model = require('../models');

router.get('/all', function(req, res, next) {
    model.dynamic_form.findAll({
        where : { userAccountId : req.user.userAccountId },
            include : [{
                model : model.survey
            }]
    }).then(function(response) {
        res.send(response);
    });
});

router.get('/help-pages/:name', function(req, res, next) {
    model.dynamic_form.findOne({
        where: {isDeleted: false, page_link: req.params.name}
    }).then(function(response) {
        if(response == null){res.send({});}
        else{res.send(response);}
    });
});

router.delete('/remove/:id', function(req, res, next) {
    model.dynamic_form.findOne({where: {id: req.params.id}}).then(function(item) {
        item.destroy().then(function(response){
            res.send({success:true, msg:response.toString()});
        },function(response){
            res.send({success:false, msg:response.toString()});
        });
    });
});


router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userAccountId = req.user.userAccountId;
    model.dynamic_form.create(record).then(function(resp) {
        res.send(resp);
    });
    // model.formType.findOne({
    //     where: {
    //         id: record.formTypeId
    //     },
    //     attributes: ['name', 'multiple'],
    //     include: [{
    //         required: false,
    //         model: model.dynamic_form,
    //         where: {
    //             userAccountId: req.user.userAccountId
    //         }
    //     }]
    // }).then(function(response) {
    //     if(response.dataValues.name == "Help Questionnaire") {
    //         model.dynamic_form.findOne({
    //             where: {
    //                  userAccountId: req.user.userAccountId,
    //                  formTypeId: record.formTypeId,
    //                  page_link: record.page_link
    //                 }
    //         }).then(function(response) {
    //             if (response) {
    //                 res.send({success: false, message: "You can make only one help form per page"});
    //             }else{
    //                 model.dynamic_form.create(record).then(function(resp) {
    //                     res.send(resp);
    //                 });
    //             }
    //         })
    //     }else{
    //         if(response.dataValues.multiple == true){
    //             model.dynamic_form.create(record).then(function(resp) {
    //                 res.send(resp);
    //             });
    //         }else{
    //             if(response.dataValues.dynamic_forms.length == 0){
    //                 model.dynamic_form.create(record).then(function(resp) {
    //                     res.send(resp);
    //                 });
    //             }else{
    //                 res.send({success: false});
    //             }         
    //         }
    //     }
        
    // });

});

router.post('/update', function(req, res, next) {
    var record = req.body.data;
    model.dynamic_form.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
        res.send(response);
    });
    // model.formType.findOne({
    //     where: {
    //         id: record.formTypeId
    //     },
    //     attributes: ['name', 'multiple'],
    //     include: [{
    //         required: false,
    //         model: model.dynamic_form,
    //         where: {
    //             userAccountId: req.user.userAccountId
    //         }
    //     }]
    // }).then(function(response) {
    //     if(response.dataValues.name == "Help Questionnaire") {
    //         model.dynamic_form.findAll({
    //             where: {
    //                  userAccountId: req.user.userAccountId,
    //                  formTypeId: record.formTypeId,
    //                  page_link: record.page_link
    //                 }
    //         }).then(function(response) {
    //              if(response.length == 0 || response[0].id == record.id) {
    //                 model.dynamic_form.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
    //                     res.send(response);
    //                 });
    //             }else{
    //                 res.send({success: false, message: "You can make only one help form per page"});
    //             }
    //         })
    //     }
    //     else{
    //         if(response.dataValues.multiple == true){
    //             model.dynamic_form.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
    //                 res.send(response);
    //             });
    //         }else{
    //             if(response.dataValues.dynamic_forms.length == 0 || response.dataValues.dynamic_forms[0].id == record.id){
    //                 model.dynamic_form.update(req.body.data, {where: { id : req.body.data.id }}).then(function(response) {
    //                     res.send(response);
    //                 });
    //             }else{
    //                 res.send({success: false});
    //             }         
    //         }
    //     }
    // });
    
});

router.get('/get', function(req, res, next) {
    model.formType.findOne({
        where: {
            name: req.query.formType
        },
        attributes: ['name', 'multiple'],
        include: [{
            required: false,
            model: model.dynamic_form,
            where: {
                userAccountId: req.user.userAccountId
            },
            include: [{
                required: false,
                model: model.formType,
                attributes: ['name', 'multiple']
            },{
                model: model.player_form_detail,
                require: false,
                foreignKey: 'dynamicFormId',
                include: [{
                    required: false,
                    model: model.game_player
                },{
                    required: false,
                    model: model.dynamic_form
                },{
                    required: false,
                    model: model.submission
                }]
            }]
        }]
    }).then(function(response) {
        res.send(response.dataValues.dynamic_forms);
    });
});


router.post('/send-form', function(req, res, next) {
    console.log('============================',req.body.data);
    model.player_form_detail.create(req.body.data).then(function(resp){
        model.player_form_detail.findOne({
            where: {
                id: resp.id
            },
            include: [{
                required: true,
                model: model.game_player
            },{
                required: true,
                model: model.dynamic_form
            }]
        }).then(function(respp) {
            var response = {
                data: respp,
                action: 'new'
            }
            req.app.get('io').emit('simulation_player_form:' + resp.gamePlanTemplateId,response)
            req.app.get('io').emit('simulation_player_form:' + resp.gamePlanTemplateId+'/'+resp.gamePlayerId,response)
            res.send(respp);
        });
    });
});
router.get('/get-form/:gameId/:playerId', function(req, res, next) {
    model.player_form_detail.findAll({
        where: {
            gamePlayerId: req.params.playerId,
            gamePlanTemplateId: req.params.gameId,
            isDeleted: false
        },
        include: [{
                required: true,
                model: model.game_player
            },{
                required: true,
                model: model.dynamic_form
            }],
        order: [
            ['createdAt', 'ASC']
        ],
    }).then(function(response) {
        res.send(response);
    });
});

router.post('/update-form-detail', function(req, res, next) {
    var data = req.body.data;
    model.player_form_detail.findOne({
        where: {
            gamePlayerId : data.gamePlayerId,
            gamePlanTemplateId : data.gamePlanTemplateId,
            dynamicFormId : data.dynamicFormId
        }
    }).then(function(respp) {
        console.log(data.submissionId,"somosmsoso",data)
        model.player_form_detail.update({
                submitted: data.submitted,
                submissionId: data.submissionId
            },{
            where: { id: respp.id }
        }).then(function(response) {
            model.player_form_detail.findOne({
                where: {
                    id : respp.id
                },
                include: [{
                    required: false,
                    model: model.game_player
                },{
                    required: false,
                    model: model.dynamic_form
                },{
                    required: false,
                    model: model.submission
                }]
            }).then(function(resppx) {
                var response = {
                    data: resppx,
                    action: 'update'
                }
        console.log('--------------,,,,,,,-------------',resppx);
                req.app.get('io').emit('simulation_player_form:' + resppx.gamePlanTemplateId,response)
                req.app.get('io').emit('simulation_player_form:' + resppx.gamePlanTemplateId+'/'+resppx.gamePlayerId,response)
                res.send(resppx);
            });
        });
        
    });
});
module.exports = router;
