'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_activities', 'activatedAt', {type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_activities', 'activatedAt')
  }
};
