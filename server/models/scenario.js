module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("scenario", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'scenarios',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.user_accounts);
                obj.belongsTo(models.category);
            }
        }
    });
    return obj;
}
