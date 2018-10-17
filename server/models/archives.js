module.exports = function(sequelize, DataTypes) {
    var archive_messages = sequelize.define("archive_message", {
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
        tableName: 'archive_messages',
        classMethods: {
            associate: function(models) {
                archive_messages.belongsTo(models.template_plan_message);
                archive_messages.belongsTo(models.game_plan_template);
                archive_messages.belongsTo(models.game_player);
            }
        }
    });

    return archive_messages;
}