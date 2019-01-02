module.exports = function(sequelize, DataTypes) {
    var question_scheduling = sequelize.define("question_scheduling",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        setOffTime: DataTypes.STRING,
        index: { type: DataTypes.INTEGER, defaultValue: 0},
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        status: { type: DataTypes.STRING, defaultValue: 'incomplete'},
        statusAt: {type: DataTypes.DATE},
        offset: {type: DataTypes.INTEGER, defaultValue: 0},
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
                question_scheduling.belongsTo(models.question);
                question_scheduling.belongsTo(models.content_plan_template, {foreignKey: 'contentPlanTemplateId'});
            }
        }
    });
    return question_scheduling;
};
