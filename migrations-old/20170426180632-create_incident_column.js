'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_activities', 'incident_id', {type: Sequelize.UUID});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_activities', 'incident_id');
  }
};
