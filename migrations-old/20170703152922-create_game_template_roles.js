'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable('game_template_roles', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          },
          gameRoleId: {
              type: Sequelize.INTEGER,
              model: 'game_role',
              key: 'id',
              index: true
          },
          userId: {
              type: Sequelize.INTEGER,
              model: 'users',
              key: 'id',
              index: true
          },
          gamePlanTemplateId: {
              type: Sequelize.INTEGER,
              model: 'game_plan_template',
              key: 'id',
              index: true
          }
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('game_template_roles')
  }
};
