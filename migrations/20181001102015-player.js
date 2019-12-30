'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('players',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      firstName : {
        type : Sequelize.STRING
      },
      lastName : {
        type : Sequelize.STRING
      },
      organizationName : {
        type : Sequelize.STRING
      },
      mobilePhone : {
        type : Sequelize.STRING
      },
      country : {
        type : Sequelize.STRING
      },
      active : {
        type : Sequelize.BOOLEAN
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
      userId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('players');
  }
};
