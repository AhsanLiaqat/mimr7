'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('libraries', 'userAccountId', { type: Sequelize.UUID ,defaultValue: Sequelize.UUIDV4})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('libraries', 'userAccountId')
  }
};
