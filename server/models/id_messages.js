module.exports = function(sequelize, DataTypes) {
    var msg = sequelize.define("id_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'id_messages',
        classMethods: {
            associate: function(models) {
                msg.belongsTo(models.user_accounts);
                msg.belongsTo(models.id_game,{foreignKey: 'idGameId'});
                msg.hasMany(models.id_schedule_message);
                // msg.belongsToMany(models.game_player, {through: 'game_player_list_players'});
            }
        }
    });
    return msg;
};
