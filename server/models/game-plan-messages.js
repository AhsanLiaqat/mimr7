module.exports = function(sequelize, DataTypes) {
    var game_plan_message = sequelize.define("game_plan_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        index: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'game_plan_messages',
        classMethods: {
            associate: function(models) {
                // game_plan_message.belongsTo(models.game_plan);
                // game_plan_message.belongsTo(models.assigned_game_message);
                // game_plan_message.hasMany(models.template_plan_message);
            }
        }
    });
    return game_plan_message;
}
