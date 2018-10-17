'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('archive_messages',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
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
    queryInterface.dropTable('archive_messages');
  }
};
