module.exports = function(sequelize, DataTypes) {
    var activities = sequelize.define("activity",{
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        responsibility_level: DataTypes.STRING,
        response_time: DataTypes.INTEGER,
        completion_time:DataTypes.INTEGER,
        possible_outcomes: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },{
        tableName: 'activities',
        classMethods: {
            associate: function(models) {
                activities.belongsTo(models.role);
                activities.belongsTo(models.organization);
                activities.belongsTo(models.department);
                activities.belongsTo(models.user, {as: 'response_actor', foreignKey: 'responseActorId'});
                activities.belongsTo(models.user, {as: 'backup_actor'});
                activities.belongsTo(models.user, {as: 'accountable_actor'});
                activities.belongsTo(models.user_accounts);
                activities.belongsTo(models.task_list);
                activities.belongsToMany(models.action_plan, {through: 'plan_activities'});
                activities.hasMany(models.incident_activity, {foreignKey: 'activity_id'});
                activities.hasMany(models.outcome, {foreignKey: 'decision_activity_id'});
                activities.hasMany(models.agenda_activity);

                activities.hasMany(models.incident_agenda_activity);


            }
        }
    });
    return activities;
}
