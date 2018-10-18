'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('message_histories', 'content',
      {
        type: Sequelize.TEXT
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    
  }
};
