var express = require('express');
var router = express.Router();
var model = require('../../models');
var Q = require('q');
var _ = require('underscore');

router.get('/get', function(req, res, next) {
    model.task_list.findOne({
        include:[{
            model: model.library_reference,
            require: false
        }],
        where: {
            id: req.query.id
        }
    }).then(function(references) {
        res.send(references);
    });
});

router.get('/all', function(req, res, next) {
    model.task_list.findAll({
        where: {userAccountId: req.query.userAccountId,isDeleted:false},
        order: [['title', 'ASC']],
        include: [{model: model.tag, attributes: ['id', 'text'], require: false },
            {model: model.all_category},
            {model: model.activity}
            ]
    }).then(function(result) {
        res.send(result);
    });
});

router.get('/un-assigned-all', function(req, res, next) {
    model.task_list.findAll({
        where: { userAccountId: req.user.userAccountId,isDeleted:false },
        include: [{ model: model.activity },{ model: model.all_category },
            { model: model.tag, attributes: ['id', 'text'], require: false, through: {attributes: []} }]
    }).then(function(references) {
        res.send(references);
    });
});

router.post('/save', function(req, res, next) {
    var record = req.body.data;
    record.userId = req.user.id;
    record.userAccountId = req.user.userAccountId;
    model.task_list.create(record).then(function(references) {
        res.send(references);

    });
});

router.post('/create-with-tags', function (req, res, next) {
    var task = req.body.data.task;
    task.userId = req.user.id;
    task.userAccountId = req.user.userAccountId;
    model.task_list.create(task)
        .then(function(task) {
            var newTags = [];
            _.each(req.body.data.tags, function (tag) {
                newTags.push(model.tag.findOne({
                    where: { text: tag.text }
                }));
            });
            Q.allSettled(newTags).then(function (res) {
                var tags = _.map(res, function (tag) { return tag.value });
                task.addTags(tags);
            });
            res.send(task);
        });
})

router.post('/update', function(req, res, next) {
    model.task_list.update(req.body.data, {where: { id : req.body.data.id }})
        .then(function(references) {
            res.send(references);
        });
});

router.post('/update-with-tags', function(req, res, next) {
    var tags = req.body.data.tags;
    delete req.body.data.tags;
    model.task_list.update(req.body.data, {where: { id : req.body.data.id }})
        .then(function(result) {
            model.task_list.findOne({
                where: { id: req.body.data.id }})
                .then(function(task) {
                    var newTags = [];
                    _.each(tags, function (tag) {
                        newTags.push(model.tag.findOne({
                            where: { text: tag.text }
                        }));
                    });
                    Q.allSettled(newTags).then(function (res) {
                        var tags = _.map(res, function (tag) { return tag.value.id });
                        task.setTags(tags);
                    });

                    res.send(task);
                });
        });
});

router.delete('/remove/:id', function(req, res, next) {
    model.task_list.destroy({where: {id: req.params.id}}).then(function(response) {
        res.send({success:true, msg:response.toString()});
    },function(response){
        model.task_list.update({isDeleted:true},{where: {id: req.params.id}}).then(function(response) {
            model.activity.destroy({ where: { taskListId: req.body.id } }).then(function(response) {
                res.send({success:true, msg:response.toString()});
            },function(response){
                model.activity.update({isDeleted:true},{ where: { taskListId: req.params.id } }).then(function(response) {
                    res.send({success:true, msg:response.toString()});
                })
            })
        })
    })
});

module.exports = router;
