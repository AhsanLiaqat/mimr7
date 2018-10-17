module.exports = function(sequelize, DataTypes) {
    var template_plan_messages = sequelize.define("template_plan_message",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        setOffTime: DataTypes.STRING,
        index: { type: DataTypes.INTEGER, defaultValue: 0},
        copy: {type: DataTypes.BOOLEAN, defaultValue: true},
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        status: { type: DataTypes.STRING, defaultValue: 'incomplete'},
        statusAt: {type: DataTypes.DATE},
        offset: {type: DataTypes.INTEGER, defaultValue: 0},
        timeleft: {type: DataTypes.INTEGER},
        skip: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        skipped_At: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'template_plan_messages',
        classMethods: {
            associate: function(models) {
                template_plan_messages.belongsTo(models.assigned_game_message, {foreignKey: 'assignedGameMessageId'});
                template_plan_messages.belongsTo(models.game_message);
                // template_plan_messages.belongsTo(models.game_plan_message, {foreignKey: 'gamePlanMessageId'});
                template_plan_messages.belongsTo(models.game_plan_template, {foreignKey: 'gamePlanTemplateId'});
                template_plan_messages.belongsTo(models.user_accounts);
                template_plan_messages.hasMany(models.read_message);
                template_plan_messages.hasMany(models.archive_message);
                template_plan_messages.hasMany(models.message_response);

                
            }
        }
    });
    return template_plan_messages;
};
