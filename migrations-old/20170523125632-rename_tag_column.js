'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('tags', 'name', 'text')
  },

  down: function (queryInterface, Sequelize) {
  }
};
