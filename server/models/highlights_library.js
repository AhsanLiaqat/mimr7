"use strict";
var path = require('path');

module.exports = function(sequelize, DataTypes) {
    var highlights_library = sequelize.define("highlights_library", {
        id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        link: DataTypes.STRING,
        filename: DataTypes.STRING,
        url: DataTypes.STRING,
        type: DataTypes.STRING,
        mimetype: DataTypes.STRING,
        tags: DataTypes.STRING,
        parentType: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'libraries',
        defaultScope: {
            where: {
                parentType: "Message",
            }
        },
        classMethods: {
            associate: function(models) {
                highlights_library.belongsTo(models.highlight, {foreignKey: 'parentId'})
                highlights_library.belongsTo(models.user_accounts);
            }
        }
     });

     return highlights_library;
};
