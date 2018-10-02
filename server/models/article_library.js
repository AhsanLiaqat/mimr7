"use strict";
var path = require('path');

module.exports = function(sequelize, DataTypes) {
    var article_library = sequelize.define("article_library", {
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
                parentType: "Article",
            }
        },
        classMethods: {
            associate: function(models) {
                article_library.belongsTo(models.article, {foreignKey: 'parentId'})
            }
        }
     });

     return article_library;
};
