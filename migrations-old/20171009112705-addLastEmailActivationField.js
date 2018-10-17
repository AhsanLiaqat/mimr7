'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'LastEmailActivation', {type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'LastEmailActivation')
  }
};
