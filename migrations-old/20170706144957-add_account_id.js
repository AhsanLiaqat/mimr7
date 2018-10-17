'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_templates', 'userAccountId', { type: Sequelize.INTEGER,
                                                                      model: 'user_accounts',
                                                                      key: 'id',
                                                                      index: true })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_plan_templates', 'userAccountId');
  }
};
