'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('messages', 'message')
    queryInterface.renameColumn('messages', 'message_new', 'message')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('messages', 'message',{type : Sequelize.STRING})
    queryInterface.renameColumn('messages', 'message', 'message_new')

  }
};
