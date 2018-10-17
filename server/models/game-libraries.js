"use strict";
var path = require('path');
var s3Library = require('../lib/aws/s3').library;

module.exports = function(sequelize, DataTypes) {
    var libraryReference = sequelize.define("game_library", {
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'game_libraries',
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
                libraryReference.belongsTo(models.game_plan);
                libraryReference.belongsTo(models.user_accounts);
                libraryReference.hasMany(models.game_message, {foreignKey: 'libId'})
            }
        }
    });

    return libraryReference;
};
