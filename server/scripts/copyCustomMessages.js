CH= {wss: {}};

var express = require('express');
var router = express.Router();
let model = require('../models');
var _ = require('underscore');


model.user_accounts.findAll({
    attributes: ['id'],
    raw: true
    }).then(function(ids){
         _.each(ids, function (idArr) {

                model.custom_message.findOne({where: {userAccountId: idArr.id, msgType: 'Type 1'}}).then(function(dd){
                    if(dd){
                        console.log("data found");
                    }else{
                        console.log("Created");
                        var data = {};
                        data.userAccountId = idArr.id;
                        data.subject = 'Attentie!';
                        data.content = '';
                        data.msgType = 'Type 1';
                        data.msgTemplateType = 'Button';
                        model.custom_message.create(data).then(function(response) {
                          data.msgType = 'Type 2';
                          model.custom_message.create(data).then(function(response) {
                            data.msgType = 'Type 3';
                            model.custom_message.create(data).then(function(response) {
                              data.msgType = 'Type 4';
                              model.custom_message.create(data).then(function(response) {
                              });
                            });
                          });
                        });
                    }
                });
         });
    });



