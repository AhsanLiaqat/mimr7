var express = require('express');
var router = express.Router();
var model = require('../../models');



router.get('/list', function(req, res, next) {
    model.all_category.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [['name', 'ASC']]
    })
        .then(function(categories) {
            res.json(categories);
        });
});

router.get('/list-with-tasks', function(req, res, next) {
    model.all_category.findAll({where: {userAccountId: req.query.userAccountId,isDeleted:false},
        order: [['name', 'ASC']],
        include: [{
            model: model.task_list,
            include: [
                {
                    model: model.library_reference
                    // attributes: ['url','mimetype']
                }
            ]
        }
        ]
    })
        .then(function(categories) {
            res.json(categories);
        });
});

router.post("/save", function(req, res, next) {
    var data = req.body.data;
    data.userAccountId = req.user.userAccountId;
    console.log(data);
    if (!data.id) {
        model.all_category.create(data).then(function(category) {
            res.json(category);
        });
    }
    else {
        model.all_category.update(data,
            {
                where: {id: data.id}
            }).then(function(category) {
            res.json(data)
        });
    }
});

router.delete("/delete/:id", function(req, res, next) {
    model.all_category.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.all_category.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        });
    })

});

module.exports = router;
