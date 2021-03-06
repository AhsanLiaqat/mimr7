module.exports = function(sequelize, DataTypes) {
    var question_scheduling = sequelize.define("question_scheduling",{
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
        tableName: 'question_schedulings',
        classMethods: {
            associate: function(models) {
                question_scheduling.belongsTo(models.user_accounts);
                question_scheduling.belongsTo(models.question);
                question_scheduling.belongsTo(models.content_plan_template, {foreignKey: 'contentPlanTemplateId'});
                question_scheduling.belongsTo(models.user);
                question_scheduling.hasOne(models.answer);
            }
        }
    });
    return question_scheduling;
};
