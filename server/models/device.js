module.exports = function(sequelize, DataTypes) {
    var devices = sequelize.define("device", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        device_token: DataTypes.STRING,
        application_arn: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'devices',
        classMethods: {
            associate: function(models) {
                devices.belongsTo(models.user);
            }
        }
    });

    return devices;
}
