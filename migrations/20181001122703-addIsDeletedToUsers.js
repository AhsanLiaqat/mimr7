'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'isDeleted', { type: Sequelize.BOOLEAN , defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('users', 'isDeleted')
  }
};
