module.exports = function(sequelize, DataTypes) {
    var player = sequelize.define("game_player", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        organizationName: DataTypes.STRING,
        email: DataTypes.STRING,
        mobilePhone: DataTypes.STRING,
        country: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // gamePlanId: DataTypes.INTEGER,
    }, {
        tableName: 'game_players',
        classMethods: {
            associate: function(models) {
                player.belongsTo(models.user_accounts);
                player.hasMany(models.player_form_detail);
                // player.belongsTo(models.game_plan);
                player.belongsTo(models.user);
                player.hasMany(models.message);
                player.hasMany(models.read_message);
                player.hasMany(models.archive_message);
                player.hasMany(models.message_response);
                player.belongsToMany(models.game_player_list, { through: 'game_player_list_players'});
                // player.hasMany(models.message, { foreignKey: 'userId', constraints: false,
                //     scope: {
                //         type: 'player'
                //     }
                // });
            }
        }
    });
    return player;
};
