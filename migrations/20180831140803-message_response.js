'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('message_responses',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      content : {
        type: Sequelize.TEXT
      },
      gamePlayerId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'game_players',
          key: 'id'
        }
      },
      gamePlanTemplateId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'game_plan_templates',
          key: 'id'
        }
      },
      templatePlanMessageId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'template_plan_messages',
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
    queryInterface.dropTable('message_responses');
  }
};
