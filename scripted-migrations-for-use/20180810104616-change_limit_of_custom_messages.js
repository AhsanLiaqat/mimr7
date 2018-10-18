
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('custom_messages', 'content_new', { type: Sequelize.TEXT})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('custom_messages', 'content_new')
  }
};
