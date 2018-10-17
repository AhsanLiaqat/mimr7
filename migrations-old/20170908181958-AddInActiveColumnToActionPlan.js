'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('action_plans', 'active', {type: Sequelize.BOOLEAN, defaultValue: true})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('action_plans', 'active')
  }
};
