'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('collections', 'text', { type: Sequelize.TEXT}),
			queryInterface.addColumn('collections', 'userAccountId', { type: Sequelize.UUID})
			])


	},

	down: function (queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn('collections', 'text'),
			queryInterface.removeColumn('collections', 'userAccountId')
			])

	}
};
