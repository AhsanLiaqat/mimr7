module.exports = function (sequelize, DataTypes) {
    var game_category = sequelize.define("game_category", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'game_categories',
        classMethods: {
            associate: function (models) {
                game_category.belongsTo(models.user_accounts);
            }
        }
    });
    return game_category;
};
