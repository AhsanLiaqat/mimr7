'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('action_plans', 'kind', { type: Sequelize.STRING, defaultValue: 'activities'})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('action_plans', 'kind')
  }
};
