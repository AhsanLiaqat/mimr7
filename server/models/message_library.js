"use strict";
var path = require('path');

module.exports = function(sequelize, DataTypes) {
    var message_library = sequelize.define("message_library", {
        id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,
        links: DataTypes.STRING,
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
                message_library.belongsTo(models.message, {foreignKey: 'parentId'})
            }
        }
     });

     return message_library;
};
