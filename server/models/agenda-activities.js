module.exports = function(sequelize, DataTypes) {
    var agenda_activity = sequelize.define("agenda_activity", {
        id: { type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        type: DataTypes.STRING,
        responsibility_level: DataTypes.STRING,
        response_time: DataTypes.INTEGER,
        completion_time:DataTypes.INTEGER,

        index: { type: DataTypes.INTEGER,defaultValue: 0 },
        tindex: {type: DataTypes.INTEGER,defaultValue: 0},
        default: { type: DataTypes.BOOLEAN,defaultValue: false },
        activated: {type: DataTypes.BOOLEAN, defaultValue: false},
        activatedAt: {type: DataTypes.DATE},
        statusAt: {type: DataTypes.DATE},
        status: { type: DataTypes.STRING, defaultValue: "incomplete"},
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'agenda_activities',
        classMethods: {
            associate: function(models) {
                agenda_activity.belongsTo(models.role);
                agenda_activity.belongsTo(models.organization);
                agenda_activity.belongsTo(models.department);
                agenda_activity.belongsTo(models.activity);
                agenda_activity.belongsTo(models.user, {as: 'response_actor' , foreignKey: 'responseActorId'});
                agenda_activity.belongsTo(models.user, {as: 'backup_actor'});
                agenda_activity.belongsTo(models.user, {as: 'accountable_actor'});
                agenda_activity.belongsTo(models.agendaPoint,{foreignKey: 'agendaPointId'});
            }
        }
    });
    return agenda_activity;
}
