module.exports = function(sequelize, DataTypes) {
    var content_plan_template = sequelize.define("content_plan_template", {
        id: { type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true },
        content_activated: { type: DataTypes.BOOLEAN,
            defaultValue: false },
        scheduled_date: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING, defaultValue: 'made' },
        start_time: { type: DataTypes.DATE },
        pause_date: { type: DataTypes.DATE },
        resume_date: { type: DataTypes.DATE },
        play_date: { type: DataTypes.DATE },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }


    },{
        tableName: 'content_plan_templates',
        classMethods: {
            associate: function(models) {
                content_plan_template.belongsTo(models.user_accounts);
                content_plan_template.belongsTo(models.collection);
                content_plan_template.belongsTo(models.class_list);
                content_plan_template.hasMany(models.scheduled_question);
                content_plan_template.hasMany(models.answer);
                content_plan_template.hasMany(models.submission);
                content_plan_template.hasMany(models.scheduled_survey);
                content_plan_template.belongsTo(models.dynamic_form);
            }
        }
    });
    return content_plan_template;
};
