'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('actions', {
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
      dueDate: {
          type: Sequelize.DATE
      },
      selectedColor: {
          type: Sequelize.STRING
      },
      actionListId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'action_lists',
              key: 'id'
          }
      },
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
              model: 'users',
              key: 'id'
          }
      },
      isDeleted: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    queryInterface.dropTable('actions');
  }
};


