'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('user_accounts', 'category_header', {type: Sequelize.STRING})
    queryInterface.addColumn('user_accounts', 'messages_font_size', {type: Sequelize.STRING})
    queryInterface.addColumn('user_accounts', 'messages_font_family', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('user_accounts', 'category_header')
    queryInterface.removeColumn('user_accounts', 'messages_font_size')
    queryInterface.removeColumn('user_accounts', 'messages_font_family')
  }
};
