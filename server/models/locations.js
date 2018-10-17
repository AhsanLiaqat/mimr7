
"use strict";

module.exports = function(sequelize, DataTypes) {
    var locations = sequelize.define("location", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        address1: DataTypes.STRING,
        address2: DataTypes.STRING,
        address3: DataTypes.STRING,
        city:     DataTypes.STRING,
        state:    DataTypes.STRING,
        country: DataTypes.STRING,
        mobilePhone: DataTypes.STRING,
        officePhone: DataTypes.STRING,
        type: DataTypes.STRING,
        location: DataTypes.JSON,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'locations',
        classMethods: {
            associate: function(models) {
                locations.belongsToMany(models.incident,
                    {as: 'incidents',
                        through: 'incident_locations',

                        foreignKey: 'locationId' });
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
