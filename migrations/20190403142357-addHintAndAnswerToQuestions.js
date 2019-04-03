'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('questions', 'hint', { type: Sequelize.TEXT})
    queryInterface.addColumn('questions', 'solution', { type: Sequelize.TEXT})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('questions', 'hint')
   queryInterface.removeColumn('questions', 'solution')
  }
};
