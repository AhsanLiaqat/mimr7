"use strict";
var path = require('path');
var s3Library = require('../lib/aws/s3').library;


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
        hooks: {
            beforeDestroy(instance, options, fn){
                instance.s3Remove();
                fn(null, instance);
            }
        },
        getterMethods: {
            s3Filename: function (){
                if (!this.__s3Filename && path != null){
                    var pth = path.parse(this.filename);
                    this.__s3Filename =  this.id + pth.ext;
                }
                return this.__s3Filename;
            }
        },
        instanceMethods: {
            s3Remove: function(){
                console.log("removing file from s3", this.s3Filename)
                try{
                    s3Library.unlink(this.s3Filename);
                } catch (e){
                    console.log("error", e);
                }
            }
        },
        classMethods: {
            associate: function(models) {
                article_library.belongsTo(models.article, {foreignKey: 'parentId'})
                article_library.belongsTo(models.user_accounts)

            }
        }
     });

     return article_library;
};
