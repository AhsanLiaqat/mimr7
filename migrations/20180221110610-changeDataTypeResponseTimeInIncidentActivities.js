'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_activities', 'response_time')
    queryInterface.removeColumn('incident_activities', 'completion_time')
    queryInterface.addColumn('incident_activities', 'response_time', { type: Sequelize.INTEGER })
    queryInterface.addColumn('incident_activities', 'completion_time', { type: Sequelize.INTEGER })

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_activities', 'response_time')
    queryInterface.removeColumn('incident_activities', 'completion_time')
    queryInterface.addColumn('incident_activities', 'response_time', { type: Sequelize.DATE })
    queryInterface.addColumn('incident_activities', 'completion_time', { type: Sequelize.DATE })
  }
};
