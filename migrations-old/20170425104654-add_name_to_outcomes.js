'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('outcomes', 'name', Sequelize.STRING);
    queryInterface.addColumn('incident_outcomes', 'name', Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('outcomes', 'name');
    queryInterface.removeColumn('incident_outcomes', 'name');
  }
};
