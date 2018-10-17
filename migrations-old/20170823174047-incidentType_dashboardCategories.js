'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable('incident_types_default_categories', {
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
            categoryId: {
                type: Sequelize.INTEGER,
                model: 'categories',
                key: 'id',
                index: true
            },
            defaultCategoryId: {
                type: Sequelize.INTEGER,
                model: 'default_categories',
                key: 'id',
                index: true
            }
        })
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable('incident_types_default_categories')
    }
};
