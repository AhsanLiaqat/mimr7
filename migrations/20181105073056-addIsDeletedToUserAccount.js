'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('user_accounts', 'isDeleted', { type: Sequelize.BOOLEAN ,defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('user_accounts', 'isDeleted')
  }
};
