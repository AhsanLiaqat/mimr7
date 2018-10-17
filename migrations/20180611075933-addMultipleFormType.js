'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('form_types', 'multiple', { type: Sequelize.BOOLEAN})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('form_types', 'multiple')
  }
};
