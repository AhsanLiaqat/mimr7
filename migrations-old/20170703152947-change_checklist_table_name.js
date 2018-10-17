'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.renameTable('check_lists', 'checkLists')
  },

  down: function (queryInterface, Sequelize) {
   
  }
};
