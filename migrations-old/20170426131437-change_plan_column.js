'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('incident_plans', 'plan_activated',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {

  }
};
