'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_plans', 'activity_status')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_plans', 'activity_status', Sequelize.JSON)
  }
};
