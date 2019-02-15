'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('questions', 'offset', { type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('questions', 'offset')
  }
};
