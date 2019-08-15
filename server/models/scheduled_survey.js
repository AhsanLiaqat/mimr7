module.exports = function(sequelize, DataTypes) {
    var scheduled_survey = sequelize.define("scheduled_survey",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        setOffTime: DataTypes.STRING,
        lastSent : DataTypes.STRING,
        type: {type: DataTypes.BOOLEAN, defaultValue: false},
        skip: {type: DataTypes.BOOLEAN, defaultValue: false},
        repeatTime: {type: DataTypes.INTEGER, defaultValue: 0},
        expiryTime: {type: DataTypes.INTEGER, defaultValue: 0},
        skipped_At: {type: DataTypes.DATE},
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        offset: {type: DataTypes.INTEGER, defaultValue: 0},
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'scheduled_surveys',
        classMethods: {
            associate: function(models) {
                scheduled_survey.belongsTo(models.user_accounts);
                scheduled_survey.belongsTo(models.content_plan_template, {foreignKey: 'contentPlanTemplateId'});
                scheduled_survey.belongsTo(models.user);
                scheduled_survey.belongsTo(models.article);
                scheduled_survey.belongsTo(models.dynamic_form);
                scheduled_survey.belongsTo(models.survey);
            }
        }
    });
    return scheduled_survey;
};
