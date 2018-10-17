'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('game_plan_templates', 'gameIncidentId')
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.addColumn('game_plan_templates', 'gameIncidentId', Sequelize.UUID)
  }
};
