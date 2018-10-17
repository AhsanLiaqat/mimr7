'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('template_plan_messages', 'offset', {type: Sequelize.INTEGER, defaultValue: 0})
    queryInterface.addColumn('game_plan_templates', 'pause_date', {type: Sequelize.DATE})
    queryInterface.addColumn('game_plan_templates', 'resume_date', {type: Sequelize.DATE})
    queryInterface.addColumn('game_plan_templates', 'play_date', {type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('template_plan_messages', 'offset')
    queryInterface.removeColumn('game_plan_templates', 'pause_date')
    queryInterface.removeColumn('game_plan_templates', 'resume_date')
    queryInterface.removeColumn('game_plan_templates', 'play_date')
  }
};
