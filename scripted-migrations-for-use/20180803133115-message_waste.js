'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('messages', 'message_new', { type: Sequelize.TEXT})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('messages', 'message_new')
  }
};
