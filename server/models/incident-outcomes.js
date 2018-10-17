module.exports = function(sequelize, DataTypes) {
    var outcomes = sequelize.define("incident_outcome", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        name: DataTypes.STRING
    }, {
        tableName: 'incident_outcomes',
        classMethods: {
            associate: function(models) {
                outcomes.belongsTo(models.incident_activity, {as: 'decision_activity', foreignKey: 'decision_activity_id'});
                outcomes.belongsTo(models.incident_activity, {as: 'outcome_activity', foreignKey: 'outcome_activity_id'});
            }
        }
    });
    return outcomes;
}
