'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
        'game_plan_templates', 'plan_activated',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
        'game_plan_templates', 'plan_activated',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      )
  }
};
