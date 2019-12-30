'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('scheduled_questions', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
    },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('scheduled_questions', 'userAccountId')
    }
};
