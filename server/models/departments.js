module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("department", {
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        //reference ???
    }, {
        tableName: 'departments',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.user_accounts);

                obj.hasMany(models.user);
                obj.hasMany(models.activity);
                obj.hasMany(models.incident_activity);
            },

            get: function(srch) {
                var deferred = Q.defer();
                if (isNaN(srch)){
                    obj.findOrCreate({where: {name: srch}}).then(function(cat){
                        deferred.resolve(cat[0]);
                    });
                } else {
                    obj.findOne({where: {id: srch}}).then(function(cat){
                        deferred.resolve(cat);
                    });
                }
                return deferred.promise;
            }
        }
    });
    return obj;
}
