
"use strict";

var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    var categories = sequelize.define("category", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'categories',
        classMethods: {
            associate: function(models) {
                categories.hasMany(models.incident, {as: 'category'})
                categories.belongsTo(models.user_accounts);
                categories.belongsToMany(models.default_category, {through: 'incident_types_default_categories'});
                categories.belongsToMany(models.checkList, {through: 'incident_types_checklists'});
            },
            get: function(srch) {
                var deferred = Q.defer();
                if (isNaN(srch)){
                    categories.findOrCreate({where: {name: srch}}).then(function(cat){
                        deferred.resolve(cat[0]);
                    });
                } else {
                    categories.findOne({where: {id: srch}}).then(function(cat){
                        deferred.resolve(cat);
                    });
                }
                return deferred.promise;
            }
        }
    });

    return categories;
}
