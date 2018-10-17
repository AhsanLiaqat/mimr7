'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('template_plan_messages', 'gameIncidentId')
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.addColumn('template_plan_messages', 'gameIncidentId', Sequelize.UUID)
  }
};
