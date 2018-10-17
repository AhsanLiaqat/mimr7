module.exports = function(sequelize, DataTypes) {
    var game_plan_template = sequelize.define("game_plan_template", {
        id: { type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true },
        plan_activated: { type: DataTypes.BOOLEAN,
            defaultValue: false },
        selected: { type: DataTypes.BOOLEAN,
            defaultValue: true },
        scheduled_date: { type: DataTypes.STRING },
        roles: { type: DataTypes.JSON },
        accountId: { type: DataTypes.INTEGER },
        status: { type: DataTypes.STRING, defaultValue: 'made' },
        roundId: { type: DataTypes.INTEGER, defaultValue: 0 },
        start_time: { type: DataTypes.DATE },
        pause_date: { type: DataTypes.DATE },
        resume_date: { type: DataTypes.DATE },
        play_date: { type: DataTypes.DATE },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }


    },{
        tableName: 'game_plan_templates',
        classMethods: {
            associate: function(models) {
                game_plan_template.belongsTo(models.game_plan);
                game_plan_template.hasMany(models.template_plan_message,
                    {foreignKey: 'gamePlanTemplateId'},
                    {onDelete: 'cascade'});
                game_plan_template.hasMany(models.player_form_detail);
                game_plan_template.belongsTo(models.incident);
                game_plan_template.belongsTo(models.game_player_list);
                // game_plan_template.hasMany(models.game_template_role);
                game_plan_template.hasMany(models.game_plan_template_round);
                game_plan_template.belongsTo(models.organization);
                game_plan_template.belongsTo(models.user_accounts);
                game_plan_template.hasMany(models.read_message);
                game_plan_template.hasMany(models.archive_message);
                game_plan_template.hasMany(models.message_response);
            }
        }
    });
    return game_plan_template;
};
