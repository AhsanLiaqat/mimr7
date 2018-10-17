module.exports = function(sequelize, DataTypes) {
    var read_message = sequelize.define("read_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'read_messages',
        classMethods: {
            associate: function(models) {
                read_message.belongsTo(models.template_plan_message);
                read_message.belongsTo(models.game_plan_template);
                read_message.belongsTo(models.game_player);
            }
        }
    });

    return read_message;
}