'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('scheduled_questions', 'repetition', { type: Sequelize.INTEGER})

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('scheduled_questions', 'repetition')
  }
};
