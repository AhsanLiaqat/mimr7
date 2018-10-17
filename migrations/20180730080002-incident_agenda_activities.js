'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('incident_agenda_activities',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      responsibility_level: {
        type: Sequelize.STRING
      },
      default: {
        type: Sequelize.BOOLEAN
      },
      copy: {
        type: Sequelize.BOOLEAN
      },
      activated: {
        type: Sequelize.BOOLEAN
      },
      activatedAt: {
        type: Sequelize.DATE
      },
      statusAt: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      index: {
        type: Sequelize.INTEGER
      },
      tindex: {
        type: Sequelize.INTEGER
      },
      response_time: {
        type: Sequelize.INTEGER
      },
      completion_time: {
        type: Sequelize.INTEGER
      },
      actionPlanId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'action_plans',
          key: 'id'
        }
      },
      activityId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'activities',
          key: 'id'
        }
      },
      departmentId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'departments',
          key: 'id'
        }
      },
      roleId: {
        type: Sequelize.UUID,
        index: true,
        references : {
          model : 'roles',
          key : 'id'
        }
      },
      organizationId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'organizations',
          key: 'id'
        }
      },
      incident_plan_id: {
        type: Sequelize.UUID,
        index: true
      },
      incidentId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'incidents',
          key: 'id'
        }
      },
      agendaActivityId: {
        type: Sequelize.UUID,
        index: true
      },
      agendaPointId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'agendaPoints',
          key: 'id'
        }
      },
      responseActorId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      backupActorId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      accountableActorId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'users',
          key: 'id'
        }
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
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('incident_agenda_activities');
  }
};
