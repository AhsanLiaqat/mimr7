module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("capacity", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        assets: DataTypes.STRING,
        description: DataTypes.STRING,
        max: DataTypes.INTEGER,
        availableOnRequest: DataTypes.STRING,
        available: DataTypes.BOOLEAN,
        additionalInfo: DataTypes.STRING,
        used: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        tableName: 'capacities',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
