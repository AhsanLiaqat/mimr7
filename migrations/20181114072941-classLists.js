'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('class_lists',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name : {
        type : Sequelize.TEXT
      },
      description : {
        type : Sequelize.STRING
      },
      createdAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      isDeleted : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      organizationId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'organizations',
          key: 'id'
        }
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('class_lists');
  }
};
