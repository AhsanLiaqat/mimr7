'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('incident_agenda_points',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      responsibilityLevel: {
        type: Sequelize.STRING
      },
      allCategoryId: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'all_categories',
          key: 'id'
        }
      },
      agendaPointId: {
        type: Sequelize.UUID,
        index: true
      },
      incident_plan_id: {
        type: Sequelize.UUID,
        index: true,
        references: {
          model: 'incident_plans',
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
    queryInterface.addColumn('incident_agenda_activities', 'incidentAgendaPointId', { type: Sequelize.UUID})
    queryInterface.removeColumn('incident_agenda_activities', 'agendaPointId')
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('incident_agenda_points');
    // queryInterface.addColumn('incident_agenda_activities', 'agendaPointId', { type: Sequelize.UUID})
    // queryInterface.removeColumn('incident_agenda_activities', 'incidentAgendaPointId')
  }
};
