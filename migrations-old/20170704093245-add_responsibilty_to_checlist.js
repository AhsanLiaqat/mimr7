'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('checkLists', 'responsibilityLevel', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('checkLists', 'responsibilityLevel')
  }
};
