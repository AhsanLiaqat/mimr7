'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('question_schedulings', 'skipped_At', { type: Sequelize.DATE})
    queryInterface.addColumn('question_schedulings', 'skip', { type: Sequelize.BOOLEAN,defaultValue : false})

  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('question_schedulings', 'skipped_At')
   queryInterface.removeColumn('question_schedulings', 'skip')
  }
};
