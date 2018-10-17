'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('agenda_activities', 'name', { type: Sequelize.STRING})
    queryInterface.addColumn('agenda_activities', 'description', { type: Sequelize.STRING})
    queryInterface.addColumn('agenda_activities', 'type', { type: Sequelize.STRING})
    queryInterface.addColumn('agenda_activities', 'responsibility_level', { type: Sequelize.STRING})

    queryInterface.addColumn('agenda_activities', 'activated', { type: Sequelize.BOOLEAN})
    queryInterface.addColumn('agenda_activities', 'activatedAt', { type: Sequelize.DATE})
    queryInterface.addColumn('agenda_activities', 'status', { type: Sequelize.STRING})
    queryInterface.addColumn('agenda_activities', 'statusAt', { type: Sequelize.DATE})

    queryInterface.addColumn('agenda_activities', 'response_time', { type: Sequelize.INTEGER})
    queryInterface.addColumn('agenda_activities', 'completion_time', { type: Sequelize.INTEGER})
    queryInterface.addColumn('agenda_activities', 'departmentId', { type: Sequelize.UUID})
    queryInterface.addColumn('agenda_activities', 'roleId', { type: Sequelize.UUID})
    queryInterface.addColumn('agenda_activities', 'organizationId', { type: Sequelize.UUID})

    queryInterface.addColumn('agenda_activities', 'responseActorId', { type: Sequelize.UUID})
    queryInterface.addColumn('agenda_activities', 'backupActorId', { type: Sequelize.UUID})
    queryInterface.addColumn('agenda_activities', 'accountableActorId', { type: Sequelize.UUID})


  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('agenda_activities', 'name')
   queryInterface.removeColumn('agenda_activities', 'description')
   queryInterface.removeColumn('agenda_activities', 'type')
   queryInterface.removeColumn('agenda_activities', 'responsibility_level')
   
   queryInterface.removeColumn('agenda_activities', 'activated')
   queryInterface.removeColumn('agenda_activities', 'activatedAt')
   queryInterface.removeColumn('agenda_activities', 'status')
   queryInterface.removeColumn('agenda_activities', 'statusAt')
   queryInterface.removeColumn('agenda_activities', 'response_time')
   queryInterface.removeColumn('agenda_activities', 'completion_time')
   queryInterface.removeColumn('agenda_activities', 'departmentId')
   queryInterface.removeColumn('agenda_activities', 'roleId')
   queryInterface.removeColumn('agenda_activities', 'organizationId')
   
   queryInterface.removeColumn('agenda_activities', 'responseActorId')
   queryInterface.removeColumn('agenda_activities', 'backupActorId')
   queryInterface.removeColumn('agenda_activities', 'accountableActorId')
  }
};
