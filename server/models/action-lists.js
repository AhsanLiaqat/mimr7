module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("action_list", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        index: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'action_lists',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.incident);
                obj.hasMany(models.action);
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
