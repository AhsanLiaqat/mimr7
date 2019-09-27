"use strict";

module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("submission", {
        id: {
            type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
		data: DataTypes.TEXT,
		isDelete : DataTypes.BOOLEAN
    }, {
        tableName: 'survey_form_data',
		classMethods: {
            associate: function (models) {
                obj.belongsTo(models.user);
                obj.belongsTo(models.scheduled_survey, {foreignKey: 'scheduledSurveyId'});
                obj.belongsTo(models.dynamic_form);
                obj.belongsTo(models.content_plan_template);
            }
        }
    });
    return obj;
}
