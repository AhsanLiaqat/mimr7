'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_templates', 'incidentId', { type: Sequelize.UUID})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('game_plan_templates', 'incidentId')
  }
};
