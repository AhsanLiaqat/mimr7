'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('id_schedule_messages', 'skipped_At', { type: Sequelize.DATE})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('id_schedule_messages', 'skipped_At')
  }
};
