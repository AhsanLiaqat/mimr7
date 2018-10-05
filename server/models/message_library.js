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
                message_library.belongsTo(models.message, {foreignKey: 'parentId'})
                message_library.belongsTo(models.user_accounts);
            }
        }
     });

     return message_library;
};
