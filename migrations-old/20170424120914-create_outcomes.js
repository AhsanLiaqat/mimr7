'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('outcomes',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        decision_activity_id: {
          type: Sequelize.INTEGER,
          index: true
        },
        outcome_activity_id: {
          type: Sequelize.INTEGER,
          index: true
        }
      })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('outcomes')
  }
};
