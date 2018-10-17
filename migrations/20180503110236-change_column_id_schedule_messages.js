'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('id_schedule_messages', 'userId')
    queryInterface.addColumn('id_schedule_messages', 'userId', { type: Sequelize.UUID })

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('id_schedule_messages', 'userId')
    queryInterface.addColumn('id_schedule_messages', 'userId', { type: Sequelize.INTEGER })
  }
};
