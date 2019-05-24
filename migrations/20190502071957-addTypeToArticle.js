'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('articles', 'type', { type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('articles', 'type')
  }
};
