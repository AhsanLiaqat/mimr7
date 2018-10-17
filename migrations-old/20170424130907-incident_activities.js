'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('incident_activities',
    {
      id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    responsibility_level: {
      type: Sequelize.STRING
    },
    response_time: {
      type: Sequelize.STRING
    },
    completion_time: {
      type: Sequelize.STRING
    },
    default: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    copy: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    activated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'incomplete'
    },
    index: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    activity_id: {
      type: Sequelize.INTEGER,
      index: true
    },
    incident_plan_id: {
      type: Sequelize.INTEGER,
      index: true
    },
    incident_id: {
      type: Sequelize.INTEGER,
      index: true
    },
    action_plan_id: {
      type: Sequelize.INTEGER,
      index: true
    },
    deaprtmentId: {
      type: Sequelize.INTEGER,
      index: true
    },
    roleId: {
      type: Sequelize.INTEGER,
      index: true
    },
    organizationId: {
      type: Sequelize.INTEGER,
      index: true
    },
    responseActorId: {
      type: Sequelize.INTEGER,
      index: true
    },
    backupActorId: {
      type: Sequelize.INTEGER,
      index: true
    },
    accountableActorId: {
      type: Sequelize.INTEGER,
      index: true
    },
    userAccountId: {
      type: Sequelize.INTEGER,
      index: true
    },
    taskListId: {
      type: Sequelize.INTEGER,
      index: true
    },
    plan_activity_id: {
      type: Sequelize.INTEGER,
      index: true
    }
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('incident_activities')
  }
};
