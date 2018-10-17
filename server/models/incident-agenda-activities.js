module.exports = function(sequelize, DataTypes) {
    var incident_agenda_activity = sequelize.define("incident_agenda_activity", {
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        type: DataTypes.STRING,
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
        tableName: 'incident_agenda_activities',
        classMethods: {
            associate: function(models) {

                incident_agenda_activity.belongsTo(models.action_plan);
                incident_agenda_activity.belongsTo(models.agenda_activity);
                incident_agenda_activity.belongsTo(models.activity);
                incident_agenda_activity.belongsTo(models.incident_agenda_point);
                incident_agenda_activity.belongsTo(models.organization);
                incident_agenda_activity.belongsTo(models.department);
                incident_agenda_activity.belongsTo(models.user, {as: 'response_actor' , foreignKey: 'responseActorId'});
                incident_agenda_activity.belongsTo(models.user, {as: 'backup_actor'});
                incident_agenda_activity.belongsTo(models.user, {as: 'accountable_actor'});
                incident_agenda_activity.belongsTo(models.role);
                incident_agenda_activity.belongsTo(models.incident_plan,{foreignKey: 'incident_plan_id'});
                incident_agenda_activity.belongsTo(models.incident);
                incident_agenda_activity.belongsTo(models.task_list, {foreignKey: 'taskListId'});
            }
        }
    });
    return incident_agenda_activity;
}