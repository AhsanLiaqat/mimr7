'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('messages', 'type', { type: Sequelize.STRING, defaultValue: 'others'})
  },
  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('messages', 'type')
  }
};
