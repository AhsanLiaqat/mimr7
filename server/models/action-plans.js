module.exports = function (sequelize, DataTypes) {
    var obj = sequelize.define("action_plan", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        description: DataTypes.STRING,
        plandate: DataTypes.DATE,
        isComplete: DataTypes.BOOLEAN,
        kind:{
            type: DataTypes.STRING,
            defaultValue: "activities"
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        type: DataTypes.STRING
    }, {
        tableName: 'action_plans',
        classMethods: {
            associate: function (models) {
                obj.belongsTo(models.category);
                obj.belongsTo(models.scenario);
                // obj.hasMany(models.action);
                obj.hasMany(models.decision);
                obj.hasMany(models.incident_plan);
                obj.belongsTo(models.user_accounts);
                obj.hasMany(models.plan_activities);
                obj.belongsToMany(models.activity, {through: 'plan_activities'});
                obj.hasMany(models.plan_activities);
                obj.hasMany(models.incident_activity, {foreignKey: 'action_plan_id'});
                obj.hasMany(models.incident_agenda_activity, {foreignKey: 'actionPlanId'});
                obj.hasMany(models.section);
                obj.belongsToMany(models.agendaPoint, {through: 'action_plan_agenda_lists', foreignKey: 'agendaPointId'});


            }
        }
    });
    return obj;
}
