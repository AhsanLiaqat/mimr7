module.exports = function(sequelize, DataTypes) {
    var incidentActivits = sequelize.define("incident_activity",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        responsibility_level: DataTypes.STRING,
        response_time: DataTypes.INTEGER,
        completion_time:DataTypes.INTEGER,
        default: {type: DataTypes.BOOLEAN, defaultValue: false},
        copy: {type: DataTypes.BOOLEAN, defaultValue: true},
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        statusAt: {type: DataTypes.DATE},
        status: { type: DataTypes.STRING, defaultValue: "incomplete"},
        index: { type: DataTypes.INTEGER, defaultValue: 0},
        tindex: { type: DataTypes.INTEGER, defaultValue: 0},
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'incident_activities',
        classMethods: {
            associate: function(models) {
                incidentActivits.belongsTo(models.role);
                incidentActivits.belongsTo(models.organization);
                incidentActivits.belongsTo(models.user, {as: 'response_actor', foreignKey: 'responseActorId'});
                incidentActivits.belongsTo(models.user, {as: 'backup_actor'});
                incidentActivits.belongsTo(models.user, {as: 'accountable_actor'});
                incidentActivits.belongsTo(models.user_accounts);
                incidentActivits.belongsTo(models.department);
                incidentActivits.belongsTo(models.task_list, {foreignKey: 'taskListId'});
                incidentActivits.belongsTo(models.activity, {foreignKey: 'activity_id'});
                incidentActivits.belongsTo(models.incident_plan, {foreignKey: 'incident_plan_id'});

                incidentActivits.belongsTo(models.incident, {foreignKey: 'incident_id'});
                incidentActivits.belongsTo(models.action_plan, {foreignKey: 'action_plan_id'});
                incidentActivits.hasMany(models.incident_outcome, {foreignKey: 'decision_activity_id'});

                incidentActivits.belongsTo(models.plan_activities, {foreignKey: 'planActivityId'});
                incidentActivits.belongsTo(models.section, {foreignKey: 'sectionId'});
            }
        }
    });
    return incidentActivits;
}
