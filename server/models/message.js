module.exports = function(sequelize, DataTypes) {
    var message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: DataTypes.STRING,
        coords: DataTypes.JSON,
        type: DataTypes.STRING,
        status:
        {
            type: DataTypes.STRING,
            defaultValue: "Incoming"
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'messages',
        classMethods: {
            associate: function(models) {
                message.belongsTo(models.incident);
                message.belongsTo(models.user, {as: 'user'});
                message.belongsTo(models.game_player);
            }
        }
    });
    return message;
}
