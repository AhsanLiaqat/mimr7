CH= {wss: {}};

var express = require('express');
var router = express.Router();
let model = require('../models');
var _ = require('underscore');



var categories = [{
    name: 'Classificatie',
    description: 'Ernst van het incident bepalen; is het gevolg van een doelgerichte actie? Zijn er aanwijzingen voor langdurige gevolgen? Neem bij o.a. natuurrampen ook weersomstandigheden mee in de beschouwing.'
},{
    name: 'Organisatie van de keten',
    description: 'Alertering; samenstelling besluitvormingsgremium; informeren van partners; afstemming & opschaling.'
},{
    name: 'Evacuatie',
    description: 'Zijn er gebouwen, objecten en/of wijken die uit voorzorg geëvacueerd moeten worden?',
},{
    name: 'Ontkoppeling kritieke processen en evenementen',
    description: 'Zijn er kritieke processen die gestopt moeten worden? Zijn er evenementen die uit voorzorg afgelast dienen te worden?'
},{
    name: 'Schaarsteverdeling',
    description: 'O.a. activeren distributieplannen, vaststellen prioriteringslijst, eventueel hulp aanvragen.'
},{
    name: 'Prioritering preventieve bescherming',
    description: 'Zijn er objecten die bewaakt dienen te worden? Zijn er bepaalde gebieden/wijken die beschermd moeten worden? Hierbij afwegen of bescherming geprioriteerd moet worden over opsporing.'
},{
    name: 'Bijzondere maatregelen',
    description: 'Moet het geweldspectrum worden uitgebreid? Zijn er andere noodbevelen die verkend of afgekondigd dienen te worden?'
},{
    name: 'Communicatie',
    description: 'Stel de aard van de communicatie vast; bepaal hoe en wanneer gezagsdragers gaan communiceren; bepaal wie er niet gaan communiceren.'
},{
    name: 'Nazorg',
    description: 'Dienen bepaalde psycho-sociale plannen geactiveerd te worden?'
},{
    name: 'Verantwoording',
    description: 'Hoe wordt omgegaan met transparantie in het besluitvormingsgremium?'
}];




model.user_accounts.findAll({
    attributes: ['id'],
    raw: true
    }).then(function(ids){
         _.each(ids, function (idArr, index) {
            _.each(categories, function(cat, index1){
                cat.position = index1;
                cat.userAccountId = idArr.id;
                console.log(cat);
                model.all_category.create(cat).then(function(res){
                    console.log('created');
                });
            });
        });
    });
