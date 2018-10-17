
"use strict";

module.exports = function(sequelize, DataTypes) {
    var locations = sequelize.define("place", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        address: DataTypes.STRING,
        location: DataTypes.JSON,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'places',
        classMethods: {
            associate: function(models) {
                locations.belongsTo(models.user_accounts);
            },
            byData: function(data) {
                var deferred = Q.defer();
                locations.findOne({where: {id: data.id}}).then(function(loc) {
                    if (loc){
                        deferred.resolve(loc);
                    } else {
                        locations.create({
                            id: data.id,
                            location: data
                        })
                    }
                })
                return deferred.promise;
            }
        }
    });
    return locations;
}
