'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('roles', 'userAccountId', {type: Sequelize.INTEGER});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('roles', 'userAccountId', {type: Sequelize.INTEGER});

  }
};
