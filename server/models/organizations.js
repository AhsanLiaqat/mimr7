module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("organization", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        city: DataTypes.STRING,
        region: DataTypes.STRING,
        state: DataTypes.STRING,
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
        tableName: 'organizations',
        classMethods: {
            associate: function(models) {

                // obj.hasMany(models.external_user);
                obj.belongsTo(models.user_accounts);
                obj.hasMany(models.user);
            },


        }
    });
    return obj;
}
