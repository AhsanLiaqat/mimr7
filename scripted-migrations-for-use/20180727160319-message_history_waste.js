'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('message_histories', 'content')
    queryInterface.renameColumn('message_histories', 'content_new', 'content')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('message_histories', 'content',{type : Sequelize.STRING})
    queryInterface.renameColumn('message_histories', 'content', 'content_new')

  }
};
