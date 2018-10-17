'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('assigned_game_messages', 'templatePlanMessageId')
    queryInterface.addColumn('template_plan_messages', 'timeleft', {type: Sequelize.INTEGER,defaultValue: 0})
    queryInterface.addColumn('game_plan_template_rounds', 'timeleft', {type: Sequelize.INTEGER,defaultValue: 0})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('assigned_game_messages', 'templatePlanMessageId', {type: Sequelize.INTEGER})
    queryInterface.removeColumn('template_plan_messages', 'timeleft')
    queryInterface.removeColumn('game_plan_template_rounds', 'timeleft')

  }
};
