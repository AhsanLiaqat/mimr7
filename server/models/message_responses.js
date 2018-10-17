module.exports = function(sequelize, DataTypes) {
    var message_response = sequelize.define("message_response", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'message_responses',
        classMethods: {
            associate: function(models) {
                message_response.belongsTo(models.template_plan_message);
                message_response.belongsTo(models.game_plan_template);
                message_response.belongsTo(models.game_player);
            }
        }
    });

    return message_response;
}