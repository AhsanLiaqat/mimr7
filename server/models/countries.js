
"use strict";

module.exports = function(sequelize, DataTypes) {
    var countries = sequelize.define("country", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        iso: DataTypes.STRING,
        iso3: DataTypes.STRING,
        nicename: DataTypes.STRING,
        numcode: DataTypes.INTEGER,
        phonecode: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'countries',
        timestamps: false,
        classMethods: {
            associate: function(models) {
                //countries.hasOne(models.user_accounts);
            }
        }
    });

    return countries;
}
