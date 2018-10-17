'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn(
          'task_lists',
          'libId',
          {
              type: Sequelize.UUID,
              model: 'library_reference',
              key: 'id'
          }
      )
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn(
          'task_lists',
          'libId',
          {
              type: Sequelize.UUID,
              model: 'library_reference',
              key: 'id'
          }
      )
  }
};
