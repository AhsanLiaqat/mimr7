module.exports = function(sequelize, DataTypes) {
    var list = sequelize.define("game_player_list", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        tableName: 'game_player_lists',
        classMethods: {
            associate: function(models) {
                list.belongsTo(models.user_accounts);
                list.belongsToMany(models.game_player, {through: 'game_player_list_players'});
                list.hasMany(models.game_plan_template);
            }
        }
    });
    return list;
};
