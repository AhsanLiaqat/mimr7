module.exports = function(sequelize, DataTypes) {
    var incident_plan = sequelize.define("incident_plan", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        plan_activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        selected: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'incident_plans',
        classMethods: {
            associate: function(models) {
                incident_plan.belongsTo(models.incident);
                incident_plan.belongsTo(models.action_plan);

                incident_plan.hasMany(models.incident_agenda_point,
                    {foreignKey: 'incident_plan_id'},
                    {onDelete: 'cascade'});
                incident_plan.hasMany(models.incident_activity,
                    {foreignKey: 'incident_plan_id'},
                    {onDelete: 'cascade'});
                incident_plan.hasMany(models.incident_agenda_activity,
                    {foreignKey: 'incident_plan_id'},
                    {onDelete: 'cascade'});
            }

        }
    });
    return incident_plan;
}
