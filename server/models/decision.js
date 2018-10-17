module.exports = function(sequelize, DataTypes) {
    var obj = sequelize.define("decision", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        possible_outcomes: DataTypes.STRING,
        responsibility_level: DataTypes.STRING,
        content:  DataTypes.JSON,
        userId: DataTypes.STRING,
        cIndex: DataTypes.INTEGER,
        responseType: DataTypes.STRING,
        externalUser: DataTypes.JSON,
        decision_type: DataTypes.STRING,
        response_time: DataTypes.STRING,
        completion_time: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status:  {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }, {
        tableName: 'decisions',
        classMethods: {
            associate: function(models) {

                obj.belongsTo(models.action_plan);
                obj.belongsTo(models.incidents_team);

                obj.belongsTo(models.user, {as: 'response_actor'});
                obj.belongsTo(models.user, {as: 'backup_actor'});
                obj.belongsTo(models.user, {as: 'accountable_actor'});
                obj.belongsTo(models.user_accounts);
            }
        }
    });
    return obj;
}
