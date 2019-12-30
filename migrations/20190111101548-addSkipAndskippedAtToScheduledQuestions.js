'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('scheduled_questions', 'skipped_At', { type: Sequelize.DATE}),
			queryInterface.addColumn('scheduled_questions', 'skip', { type: Sequelize.BOOLEAN,defaultValue : false})
			])
		
	},

	down: function (queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn('scheduled_questions', 'skipped_At'),
			queryInterface.removeColumn('scheduled_questions', 'skip')
			])

	}
};
