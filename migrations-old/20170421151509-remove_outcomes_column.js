'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('activities', 'outcomes')
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.addColumn('activities', 'outcomes', Sequelize.JSON)
  }
};
