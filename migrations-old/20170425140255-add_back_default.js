'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('plan_activities', 'default', {type: Sequelize.BOOLEAN, defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('plan_activities', 'default')
  }
};
