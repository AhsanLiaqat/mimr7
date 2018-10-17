'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incident_plans', 'selected', {type: Sequelize.BOOLEAN, defaultValue: true})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incident_plans', 'selected')
  }
};
