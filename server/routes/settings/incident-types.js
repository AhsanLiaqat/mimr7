var express = require('express');
var router = express.Router();
var model = require('../../models');



router.get('/list', function(req, res, next) {
    console.log(req.user);
    model.category.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},

        include: [{
            model: model.default_category,
            require: false,
            as: 'default_categories',
            attributes: ['name', 'status', 'id', 'position']
        },
        {
            model: model.checkList,
            require: false,
            as: 'checkLists'
        }

        ],
        order: [
            ['name', 'ASC']
        ],
    })
        .then(function(users) {
            res.json(users);
        });
});

router.get('/all', function(req, res, next) {
    console.log(req.user);
    model.category.findAll({where: {userAccountId: req.user.userAccountId,isDeleted:false},
        order: [
            ['name', 'ASC']
        ],
    })
        .then(function(users) {
            res.json(users);
        });
});


router.get('/item', function(req, res, next) {
    var cat_id = req.query.id;
    model.category.findOne({where: {id: cat_id},
        include: [{
            model: model.default_category,
            require: false,
            as: 'default_categories',
            attributes: ['name', 'status', 'id', 'position']
        },
        {
            model: model.checkList,
            require: false,
            as: 'checkLists',
            include: [{model: model.task_list, as: 'tasks'}]
        }]})

        .then(function(cat) {
            res.json(cat);
        });
});

router.post("/save", function(req, res, next) {
    var data = req.body.data;
    data.userAccountId = req.user.userAccountId;
    if (!data.id) {
        model.category.create(data).then(function(type) {
            type.setDefault_categories(data.default_categories);
            type.setCheckLists(data.checkLists);
            res.json(type);
        });

    } else {
        model.category.update(data,
            {
                where: {id: data.id}
            }).then(function() {
            model.category.findOne({where: {id: data.id}})
                .then(function(cat) {
                    cat.setDefault_categories(data.default_categories);
                    cat.setCheckLists(data.checkLists);
                    res.json("update");
                });
        });
    }
});

router.delete("/delete/:id", function(req, res, next) {
    var cat_id = req.params.id;
    model.category.destroy({where: {id: cat_id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.category.update({isDeleted:true},{where: {id: cat_id}}).then(function(response) {
            res.send({success:true, msg:response.toString()});
        })
    })
});

module.exports = router;
