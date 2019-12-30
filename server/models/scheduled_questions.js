module.exports = function(sequelize, DataTypes) {
    var scheduled_question = sequelize.define("scheduled_question",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        setOffTime: DataTypes.STRING,
        index: { type: DataTypes.INTEGER, defaultValue: 0},
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        skip: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        skipped_At: {type: DataTypes.DATE},
        status: { type: DataTypes.BOOLEAN, defaultValue: 0},
        read_messages: { type: DataTypes.BOOLEAN, defaultValue: 0},
        statusAt: {type: DataTypes.DATE},
        offset: {type: DataTypes.INTEGER, defaultValue: 0},
        repetition: {type: DataTypes.INTEGER},
        total_time: {type: DataTypes.INTEGER, defaultValue: 0},
        timeleft: {type: DataTypes.INTEGER},
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'scheduled_questions',
        classMethods: {
            associate: function(models) {
                scheduled_question.belongsTo(models.user_accounts);
                scheduled_question.belongsTo(models.message);
                scheduled_question.belongsTo(models.content_plan_template, {foreignKey: 'contentPlanTemplateId'});
                scheduled_question.belongsTo(models.user);
                scheduled_question.hasOne(models.answer);
            }
        }
    });
    return scheduled_question;
};
