'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('student_messages',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      content : {
        type : Sequelize.TEXT
      },
      description : {
        type : Sequelize.TEXT
      },
      status : {
        type : Sequelize.STRING
      },
      setOffTime: {
          type: Sequelize.STRING
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
      userId : {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('student_messages');
  }
};
