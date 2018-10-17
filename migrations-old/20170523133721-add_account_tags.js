'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('tags', 'userAccountId', {type: Sequelize.INTEGER})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('tags', 'userAccountId', {type: Sequelize.INTEGER})
  }
};
