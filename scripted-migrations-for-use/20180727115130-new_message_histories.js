
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('message_histories', 'content_new', { type: Sequelize.TEXT})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('message_histories', 'content_new')
  }
};
