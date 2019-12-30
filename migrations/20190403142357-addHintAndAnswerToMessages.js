'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('messages', 'hint', { type: Sequelize.TEXT}),
            queryInterface.addColumn('messages', 'solution', { type: Sequelize.TEXT})
            ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('messages', 'hint'),
            queryInterface.removeColumn('messages', 'solution')
            ]);
    }
};
