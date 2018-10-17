'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('task_lists', 'tags', {type: Sequelize.JSON})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('task_lists', 'tags', {type: Sequelize.JSON})
  }
};
