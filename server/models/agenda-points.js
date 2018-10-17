module.exports = function(sequelize, DataTypes) {
    var agendaPoint = sequelize.define("agendaPoint", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        responsibilityLevel: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'agendaPoints',
        classMethods: {
            associate: function(models) {
                agendaPoint.belongsTo(models.user_accounts);
                agendaPoint.belongsTo(models.all_category);
                agendaPoint.belongsToMany(models.activity, {through: 'agenda_activities', foreignKey: 'activityId'});
                agendaPoint.belongsToMany(models.action_plan, {through: 'action_plan_agenda_lists', foreignKey: 'actionPlanId'});
                agendaPoint.hasMany(models.agenda_activity);

            }
        }
    });

    return agendaPoint;
};
