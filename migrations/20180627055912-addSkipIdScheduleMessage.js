'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('id_schedule_messages', 'skip', { type: Sequelize.BOOLEAN, defaultValue: false})
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('id_schedule_messages', 'skip')
  }
};
