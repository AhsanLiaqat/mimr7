module.exports = function(sequelize, DataTypes) {

    var game = sequelize.define("id_game", {
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
        tableName: 'id_games',
        classMethods: {
            associate: function(models) {
                game.belongsTo(models.user_accounts);
                game.hasMany(models.id_message,{foreignKey: 'idGameId'});
                game.hasMany(models.id_schedule_game);

                // game.belongsToMany(models.game_player, {through: 'game_player_list_players'});
            }
        }
    });
    return game;
};
