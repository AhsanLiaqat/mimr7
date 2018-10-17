'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('activities', 'response_time')
    queryInterface.removeColumn('activities', 'completion_time')
    queryInterface.addColumn('activities', 'response_time', { type: Sequelize.INTEGER })
    queryInterface.addColumn('activities', 'completion_time', { type: Sequelize.INTEGER })

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('activities', 'response_time')
    queryInterface.removeColumn('activities', 'completion_time')
    queryInterface.addColumn('activities', 'response_time', { type: Sequelize.DATE })
    queryInterface.addColumn('activities', 'completion_time', { type: Sequelize.DATE })
  }
};
