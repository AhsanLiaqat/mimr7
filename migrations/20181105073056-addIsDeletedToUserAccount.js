'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('user_accounts', 'isDeleted', { type: Sequelize.BOOLEAN ,defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('user_accounts', 'isDeleted')
  }
};
