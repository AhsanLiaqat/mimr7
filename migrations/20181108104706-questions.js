'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('questions',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name : {
        type : Sequelize.TEXT
      },
      number : {
        type : Sequelize.INTEGER
      },
      type : {
        type : Sequelize.STRING
      },
      isDeleted : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP WITH TIME ZONE",
        allowNull: false
      },
      messageId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'messages',
          key: 'id'
        }
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('questions');
  }
};
