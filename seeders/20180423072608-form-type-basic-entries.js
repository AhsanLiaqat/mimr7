'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('form_types', [{
			id: '00000000-0000-0000-0000-abef45637adb',
			name : 'Planning Questionnaire',
			description: 'This type is used for making Questionnaire on planinng dashboard.',
			createdAt : new Date(),
			updatedAt : new Date(),
      multiple : true
		},{
      id: '00000000-0000-0000-0000-abef45637abd',
      name : 'Incident Questionnaire',
      description: 'This type is used for making Questionnaire for Incidents.',
      createdAt : new Date(),
      updatedAt : new Date(),
      multiple : false
    },{
      id: '00000000-0000-0000-0000-abef45637abc',
      name : 'Simulation Game Feedback Questionnaire',
      description: 'This type is used for taking Feedback for Simulation Games.',
      createdAt : new Date(),
      updatedAt : new Date(),
      multiple : true
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('form_types', [{
      name :'Planning Questionnaire'
    },{
      name :'Incident Questionnaire'
    },{
      name :'Simulation Game Feedback Questionnaire'
    }])
  }
};
