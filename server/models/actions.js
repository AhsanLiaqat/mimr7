module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("action", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        index: DataTypes.INTEGER,
        selectedColor: DataTypes.STRING,
        dueDate: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'actions',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.action_list);
                obj.belongsTo(models.user);
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
