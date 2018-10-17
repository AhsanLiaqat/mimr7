module.exports = function(sequelize, DataTypes) {
    var player = sequelize.define("player", {
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
        tableName: 'players',
        classMethods: {
            associate: function(models) {
                player.belongsTo(models.user);
            }
        }
    });
    return player;
};
