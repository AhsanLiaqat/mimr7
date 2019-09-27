'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return  queryInterface.createTable('survey_form_data',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      contentPlanTemplateId: {
          type: Sequelize.UUID,
          index: true,
          references: {
            model: 'content_plan_templates',
            key: 'id'
          }
      },
      scheduledSurveyId: {
          type: Sequelize.UUID,
          index: true,
          references: {
            model: 'scheduled_surveys',
            key: 'id'
          }
      },
      dynamicFormId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'dynamic_forms',
          key: 'id'
        }
      },
      data: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      isDelete : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    return  queryInterface.dropTable('survey_form_data');
  }
};
