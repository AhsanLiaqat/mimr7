var express = require('express');
var router = express.Router();
var model = require('../../models');


router.get('/all', function(req, res, next) {
    model.game_plan_team.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [ ['name', 'ASC'] ],
        include: [{model: model.game_role}]
    })
        .then(function(users) {
            res.json(users);
        });
});
router.get('/get-teams-for-games/:id?', function(req, res, next) {
    var cat_id = req.params.id;
    model.game_plan_team.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false,gamePlanId: cat_id,isDeleted:false},
        order: [ ['name', 'ASC'] ],
        include: [{model: model.game_role}]
    })
        .then(function(users) {
            res.json(users);
        });
});

router.post("/save", function(req, res, next) {
    var data = req.body.data;
    data.userAccountId = req.user.userAccountId;
    console.log(data);
    if (!data.id) {
        model.game_plan_team.create(data).then(function(type) {
            res.json(type);
        });
    }
    else {
        model.game_plan_team.update(data,
            {
                where: {id: data.id}
            }).then(function() {
            res.json()
        });
    }
});

router.post("/delete", function(req, res, next) {
    var cat_id = req.body.id;
    model.game_plan_team.destroy({where: {id: cat_id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_plan_team.update({isDeleted:true},{where: {id: cat_id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });
});

module.exports = router;
