'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('game_plan_templates', 'organizationId', { type: Sequelize.INTEGER,
                                                                        model: 'organizations',
                                                                        key: 'id',
                                                                        index: true });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('game_plan_templates', 'organizationId');
  }
};
