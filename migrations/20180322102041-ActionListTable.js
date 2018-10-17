'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('action_lists', {
      id: {
        "primaryKey": true,
        "type": "UUID",
        "defaultValue": Sequelize.UUIDv4
        },
      createdAt: {
          type: Sequelize.DATE
      },
      updatedAt: {
          type: Sequelize.DATE
      },
      name: {
          type: Sequelize.STRING
      },
      index: {
          type: Sequelize.INTEGER
      },
      isDeleted: {
          type: Sequelize.BOOLEAN, defaultValue: false
      },
      incidentId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'incidents',
              key: 'id'
          }
      },
      userAccountId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'user_accounts',
              key: 'id'
          }
      }
    })
    
  },


  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('action_lists');
  }
};
