module.exports = function(sequelize, DataTypes) {
    var agendaPoint = sequelize.define("incident_agenda_point", {
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
        tableName: 'incident_agenda_points',
        classMethods: {
            associate: function(models) {
                agendaPoint.belongsTo(models.user_accounts);
                agendaPoint.belongsTo(models.all_category);
                agendaPoint.belongsTo(models.incident_plan,{foreignKey: 'incident_plan_id'});
                agendaPoint.belongsTo(models.agendaPoint);
                agendaPoint.hasMany(models.incident_agenda_activity ,{foreignKey: 'incidentAgendaPointId'});
            }
        }
    });

    return agendaPoint;
};
