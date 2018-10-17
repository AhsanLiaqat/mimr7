'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_plan_template_rounds', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          name: {
              type: Sequelize.STRING
          },
          timeSpan: {
              type: Sequelize.INTEGER
          },
          templatePlanMessageId: {
              type: Sequelize.INTEGER,
              model: 'template_plan_message',
              key: 'id',
              index: true
          },
          gamePlanTemplateId: {
              type: Sequelize.INTEGER,
              model: 'game_plan_templates',
              key: 'id',
              index: true
          },
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_plan_template_rounds')
  }
};
