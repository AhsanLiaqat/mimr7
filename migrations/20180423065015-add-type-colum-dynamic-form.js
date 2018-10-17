'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		queryInterface.addColumn(
			'dynamic_forms', 'formType',
			{
				type: Sequelize.STRING
			}
		)
	},

	down: function (queryInterface, Sequelize) {
		queryInterface.removeColumn('dynamic_forms', 'formType')
	}
};
