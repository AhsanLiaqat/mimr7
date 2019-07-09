'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.addColumn('question_schedulings', 'userAccountId', { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 })
    })
    },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      queryInterface.removeColumn('question_schedulings', 'userAccountId')
    })
    }
};
