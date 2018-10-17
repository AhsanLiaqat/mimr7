module.exports = function(sequelize, DataTypes) {
    var game = sequelize.define("id_schedule_game", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        time: DataTypes.INTEGER,

        scheduled_date: DataTypes.DATE,
        activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        played_At: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        tableName: 'id_schedule_games',
        classMethods: {
            associate: function(models) {
                game.belongsTo(models.user_accounts);
                game.belongsTo(models.id_game);
                game.hasMany(models.id_schedule_message,
                    {foreignKey: 'idScheduleGameId'},
                    {onDelete: 'cascade'});

                game.belongsTo(models.incident);
                // game.belongsToMany(models.game_player, {through: 'game_player_list_players'});
            }
        }
    });
    return game;
};
