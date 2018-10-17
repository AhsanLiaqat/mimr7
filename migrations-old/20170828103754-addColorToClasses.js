'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('message_histories', 'selectedColor', {type: Sequelize.STRING})
    queryInterface.addColumn('message_historyHistories', 'selectedColor', {type: Sequelize.STRING})
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('message_histories', 'selectedColor')
    queryInterface.removeColumn('message_historyHistories', 'selectedColor')

  }
};
