'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('answers', 'ScheduledQuestionId', { type: Sequelize.UUID ,defaultValue: Sequelize.UUIDV4})
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('answers', 'ScheduledQuestionId')
  }
};
