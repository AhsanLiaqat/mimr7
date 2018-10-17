'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('organizations', 'state', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('organizations', 'state', {type: Sequelize.STRING})

  }
};
