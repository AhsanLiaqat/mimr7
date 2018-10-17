'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('incidents', 'actionPlanId')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('incidents', 'actionPlanId', Sequelize.INTEGER)
  }
};
