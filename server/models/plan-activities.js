module.exports = function(sequelize, DataTypes) {
    var plan_activities = sequelize.define("plan_activities", {
        id: { type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true },
        index: { type: DataTypes.INTEGER,defaultValue: 0 },
        tindex: {type: DataTypes.INTEGER,defaultValue: 0},
        default: { type: DataTypes.BOOLEAN,defaultValue: false },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'plan_activities',
        classMethods: {
            associate: function(models) {

                plan_activities.belongsTo(models.action_plan);
                plan_activities.belongsTo(models.activity);
                plan_activities.hasMany(models.incident_activity);

                plan_activities.belongsTo(models.section);
            }
        }
    });
    return plan_activities;
}
