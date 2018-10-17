'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'LastUpdatePassword', {type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'LastUpdatePassword')
  }
};
