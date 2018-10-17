module.exports = function(sequelize, DataTypes) {
    var teams = sequelize.define("incidents_team", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        // users: DataTypes.JSON,
        emailList: DataTypes.JSON,
        teamType: DataTypes.STRING,
        activeTime: DataTypes.DATE,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'incidents_teams',
        classMethods: {
            associate: function(models) {
                teams.belongsTo(models.user_accounts);
                // teams.belongsTo(models.user);
                teams.belongsToMany(models.user, {through: 'user_teams'});

            }

        }
    });

    return teams;
}
