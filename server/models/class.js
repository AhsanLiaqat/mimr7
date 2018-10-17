module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("class", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        index: DataTypes.INTEGER,
        title: DataTypes.STRING,
        summary: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'classes',
        classMethods: {
            associate: function(models) {
                obj.belongsTo(models.incident);
                obj.hasMany(models.message_history, {as: 'messages'});
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
