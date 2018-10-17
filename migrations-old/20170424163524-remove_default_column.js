'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('plan_activities', 'default')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('plan_activities', 'default', Sequelize.BOOLEAN)
  }
};
