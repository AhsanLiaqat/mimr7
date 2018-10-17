
"use strict";

var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    var categories = sequelize.define("default_category", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        position: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'default_categories',
        classMethods: {
            associate: function(models) {
                categories.belongsTo(models.user_accounts);
                categories.belongsTo(models.category);
                categories.belongsToMany(models.category, {through: 'incident_types_default_categories'});
            }

        }
    });

    return categories;
}
