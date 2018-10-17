module.exports = function(sequelize, DataTypes) {
    var msg = sequelize.define("id_schedule_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: DataTypes.STRING,
        order: DataTypes.INTEGER,
        activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        offset: DataTypes.INTEGER,
        setOffTime: DataTypes.DATE,
        activated_At: DataTypes.DATE,
        skip: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        skipped_At: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'id_schedule_messages',
        classMethods: {
            associate: function(models) {
                msg.belongsTo(models.user_accounts);
                msg.belongsTo(models.id_message);
                msg.belongsTo(models.id_schedule_game);
                msg.belongsTo(models.user);
                // msg.belongsToMany(models.game_player, {through: 'game_player_list_players'});
            }
        }
    });
    return msg;
};
