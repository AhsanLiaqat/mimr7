'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('message_histories', 'content',
      {
        type: Sequelize.TEXT
      }
    )
    queryInterface.changeColumn('messages', 'message',
      {
        type: Sequelize.TEXT
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    
  }
};