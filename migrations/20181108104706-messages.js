'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('messages',
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
      highlightId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'highlights',
          key: 'id'
        }
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
