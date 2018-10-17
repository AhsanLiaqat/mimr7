'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('custom_messages', 'content')
    queryInterface.renameColumn('custom_messages', 'content_new', 'content')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('custom_messages', 'content',{type : Sequelize.STRING})
    queryInterface.renameColumn('custom_messages', 'content', 'content_new')

  }
};
