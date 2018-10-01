'use strict'
var models = require('./server/models/');
var Sequelize =  require("sequelize");
var fs =  require("fs");

delete models.default;

const sequelize = new Sequelize(
    'crisishub',
    'postgres',
    'sasa', {
        host: 'localhost',
        dialect: 'postgres',
    }
);
for(let model in models) {

    let attributes = models[model].attributes;

    for(let column in attributes) {
        delete attributes[column].Model;
        delete attributes[column].fieldName;
        delete attributes[column].field;
        for(let property in attributes[column]) {
            if(property.startsWith('_')) {
                delete attributes[column][property];
            }
        }

        if(typeof attributes[column]['type'] !== 'undefined') {

            if(typeof attributes[column]['type']['options'] !== 'undefined' && typeof attributes[column]['type']['options'].toString === 'function') {
                attributes[column]['type']['options'] = attributes[column]['type']['options'].toString(sequelize);
            }

            if(typeof attributes[column]['type'].toString === 'function') {
                attributes[column]['type'] = attributes[column]['type'].toString(sequelize);
            }

        }

    }

    let schema = JSON.stringify(attributes, null, 4);
    console.log('Schema---------------------',model,typeof(schema));
    let tableName = models[model].tableName;
    let indexes = ['\n'];

    if(models[model].options.indexes && models[model].options.indexes.length) {

        models[model].options.indexes.forEach((obj) => {

            indexes.push('        .then(() => {');
            indexes.push('            return queryInterface.addIndex(');
            indexes.push(`                '${tableName}',`);
            indexes.push(`                ['${obj.fields.join("','")}']`);

            let opts = {};
            if(obj.name) {
                opts.indexName = obj.name;
            }
            if(obj.unique === true) {
                opts.indicesType = 'UNIQUE';
            }
            if(obj.method === true) {
                opts.indexType = obj.method;
            }
            if(Object.keys(opts).length) {
                indexes.push(`                , ${JSON.stringify(opts)}`)
            }

            indexes.push('            )');
            indexes.push('        })');

        });

    }
    if(typeof(schema) == 'string'){
        schema = schema.split('\n').map((line) => '            ' + line).join('\n');

        let template = `'use strict';
        module.exports = {
            up: function(queryInterface, Sequelize) {
                return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
                .then(() => {
                    return queryInterface.createTable('${tableName}',
                    ${schema})
                })${indexes.join('\n')}
                .then(() => {
                    return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
                });
            },
            down: function(queryInterface, Sequelize) {
                return queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED')
                .then(() => {
                    return queryInterface.dropTable('${tableName}');
                })
                .then(() => {
                    return queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
                });
            }
        };`

        let d = new Date();

        let filename = [d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((num) => num <= 60 && (num + 100).toString().substring(1) || num)
        .join('') + `-${models[model].tableName}`;

        // fs.writeFileSync(`./migrations/${filename}.js`, template);

    }else {
        console.log("+++++++*****+*+*+*+*+*+*+*+*+*+*+*+*>>>>>>>>>>",model);
    }
};
