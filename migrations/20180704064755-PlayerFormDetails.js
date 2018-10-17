'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('player_form_details',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      submitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gamePlayerId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'game_players',
          key: 'id'
        }
      },
      dynamicFormDatumId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'dynamic_forms',
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
      submissionId: {
        type: Sequelize.UUID,
        index: true
      },
      gamePlanTemplateId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'game_plan_templates',
          key: 'id'
        }
      },
      isDeleted : {
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
    queryInterface.dropTable('player_form_details');
  }
};
