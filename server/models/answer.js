module.exports = function(sequelize, DataTypes) {
    var answer = sequelize.define("answer",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        text: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'answers',
        classMethods: {
            associate: function(models) {
                answer.belongsTo(models.question);
                answer.belongsTo(models.content_plan_template, {foreignKey: 'contentPlanTemplateId'});
                answer.belongsTo(models.user);
            }
        }
    });
    return answer;
};
