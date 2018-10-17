var express = require('express');
var router = express.Router();
var model = require('../../models');


router.get('/all', function(req, res, next) {
    model.game_category.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [ ['name', 'ASC'] ],
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
        model.game_category.create(data).then(function(type) {
            res.json(type);
        });
    }
    else {
        model.game_category.update(data,
            {
                where: {id: data.id}
            }).then(function() {
            res.json()
        });
    }
});

router.post("/delete", function(req, res, next) {
    var cat_id = req.body.id;
    model.game_category.destroy({where: {id: cat_id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.game_category.update({isDeleted:true},{where: {id: cat_id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    });

});

module.exports = router;
