module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("alert_history", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: DataTypes.STRING,
        content: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, {
        tableName: 'alert_histories',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.user);
            }
        }
    });
    return obj;
}
